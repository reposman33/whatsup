import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, documentId, getDoc, Firestore, query, where, orderBy, DocumentReference, DocumentData, updateDoc, writeBatch, getDocs } from '@angular/fire/firestore';
import { Contact } from '../../../models/contact.model';
import { Message } from '../../../models/message.model';
import { Observable, firstValueFrom, map, of, switchMap } from 'rxjs';
import { StorageProvider } from '../storage-provider';
import { Group, Membership } from '../../../models';
import { Temporal } from 'temporal-polyfill';
import { GroupInvitation } from '../../../models/groupInvitation';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService implements StorageProvider{

  private firestore = inject(Firestore);

  async addGroup(group: Group): Promise<DocumentReference<DocumentData, DocumentData>> {
    const groupCollectionRef = collection(this.firestore, 'groups')
    return await addDoc(groupCollectionRef, group)
  }

  // voeg nieuwe 'pending' invitations toe aan collectie
  async addGroupInvitations(contacts: Contact[], fromUserId: string, groupId: string) : Promise<DocumentReference<DocumentData, DocumentData>[]> {
    console.log('contacts: ', contacts);
    console.log('fromUserId: ', fromUserId);
    console.log('groupId: ', groupId);
    if(!contacts || contacts.length === 0) {
      throw new Error('Geen contacten meegegeven')
    }

    const groupInvitationsCollectionRef = collection(this.firestore, 'groupInvitations')
    const now = Temporal.Now.zonedDateTimeISO().toString()

    return await Promise.all(contacts.map(contact => {
      const invitation = {
        acceptedAt: '',
        createdAt: now,
        fromUserId: fromUserId,
        groupId: groupId,
        status: 'pending',
        toUserId: contact.id
      }

      return addDoc(groupInvitationsCollectionRef, invitation)
    }))
  }

  addMembership(membership: Membership): Promise<DocumentReference<DocumentData, DocumentData>> {
    const membershipsCollectionRef = collection(this.firestore, 'memberships')
    return addDoc(membershipsCollectionRef, membership)
  }

  async addMessage(message: Message): Promise<void> {
    const messagesCollection = collection(this.firestore, 'messages')
    await addDoc(messagesCollection, message)
  }

  async deleteGroup(id: string, userId: string): Promise<void> {
    // gebruik writeBatch i.p.v. firstValueFrom en Promise.all om meerdere documenten tegelijk te verwijderen want dit is atomic.
    const deleteBatch = writeBatch(this.firestore)

    const membershipQuery = query(collection(this.firestore, 'memberships'), where("groupId", "==", id), where("contactId", "==", userId))
    const membershipSnapshot = await getDocs(membershipQuery)

    membershipSnapshot.forEach(membershipDocRef => {
      // voeg het membership document toe aan de deleteBatch
      deleteBatch.delete(membershipDocRef.ref)
    });
    
    // voeg het group document toe aan de deleteBatch
    const groupDocRef = doc(this.firestore, `groups/${id}`)
    deleteBatch.delete(groupDocRef)

    // verwijder alle documenten in de batch
    await deleteBatch.commit()
  }
  
  async getContact(id: string): Promise<Contact | undefined> {
    const docRef = doc(this.firestore, `contacts/${id}`);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return undefined;
    const data = await snap.data() as Contact;

    // attach id if needed
    return { ...data, id: snap.id } as Contact;
  }

  getContacts(): Observable<Contact[]> {
    const contactsRef = collection(this.firestore, 'contacts');
    return collectionData(contactsRef, { idField: 'id' }) as Observable<Contact[]>;    
  }

  getContactsByGroup(groupId: string): Observable<Contact[]> {
    const membershipQuery = query(collection(this.firestore, 'memberships'), where("groupId", "==", groupId));

    return (collectionData(membershipQuery, {idField: 'id'}) as Observable<Membership[]>).pipe(
      switchMap((memberships: Membership[]): Observable<Contact[]> => {
        const userIds = memberships.map( (membership: Membership): string => membership.contactId);
        
        if(userIds.length === 0) {
          return of([]) as Observable<Contact[]>
        }

        const contactsQuery = query(collection(this.firestore, 'contacts'), where(documentId(), "in", userIds))

        return collectionData(contactsQuery, {idField: 'id'}) as Observable<Contact[]>
      })
    )
  }

  getGroupsForContact(id: string): Observable<Group[]> {
    const membershipQuery = query(collection(this.firestore, 'memberships'), where("contactId","==",id));

    return (collectionData(membershipQuery, {idField: 'id'}) as Observable<Membership[]>).pipe(
      switchMap((memberships: Membership[]): Observable<Group[]> => {
        const groupIds = memberships.map( (membership: Membership): string => membership.groupId);

        if(groupIds.length === 0) {
          return of([]) as Observable<Group[]>
        }
        const groupsQuery = query(collection(this.firestore, 'groups'), where(documentId(), "in", groupIds));

        return collectionData(groupsQuery, {idField: 'id'}) as Observable<Group[]>
      })
    )
  }

  getMessagesWithSelectedContact(id: string): Observable<Message[]> {
    const q = query(collection(this.firestore, 'messages'), where("conversationId", "==", id), orderBy('timeStamp', 'asc'))
    return collectionData (q, {idField: 'id'}) as Observable<Message[]>
  }

  // Haal alle groepen op waarvoor de gebruiker is uitgenodigd op
  getPendingGroups(userid: string): Observable<(Group & {invitationId: string})[]> {
    const groupInvitationsQuery = query(collection(this.firestore, 'groupInvitations'), where("toUserId", "==", userid), where("status", "==", "pending"))
    
    return (collectionData(groupInvitationsQuery, {idField: 'id'}) as Observable<GroupInvitation[]>).pipe(
      switchMap((groupInvitations): Observable<(Group & {invitationId: string})[]> => {
        
        if(groupInvitations.length == 0) {
          return of([]) as unknown as Observable<(Group & {invitationId: string})[]>
        }

        const invitationsByGroupId = new Map<string, string>(groupInvitations.map(inv => [inv.groupId, inv.id!]))
        const groupsQuery = query(collection(this.firestore,'groups'), where(documentId(), "in", groupInvitations.map(inv => inv.groupId)))

      return (collectionData(groupsQuery, {idField: 'id'}) as Observable<(Group & {invitationId: string})[]>).pipe(
        // geef een Group array terug met de invitationId
        map(groups => groups.map((group: Group) => ({...group, invitationId: invitationsByGroupId.get(group.id!)})))
      ) as Observable<(Group & {invitationId: string})[]>
      })
    )
  }
  
  async getUserIdByEmailAddress(email:string): Promise<string | undefined> {
    const q = query(collection(this.firestore,'contacts'), where('email','==',email))
    const contacts = await firstValueFrom(collectionData(q, {idField: 'id'}))

    return contacts[0]?.id
  }

  async updateGroupInvitation(invitationId: string, groupId: string, status: 'accept' | 'decline', userId: string): Promise<DocumentReference<DocumentData, DocumentData> | undefined> {
    // update de groupInvitation
    const acceptedAt = Temporal.Now.zonedDateTimeISO().toString()
    const groupInvitationRef = doc(this.firestore, 'groupInvitations', invitationId)

    await updateDoc(groupInvitationRef, {
      status: status,
      acceptedAt: acceptedAt
    })

    if(status === 'accept') {
      // voeg een nieuwe membership document toe
      const membership = {
        groupId: groupId,
        contactId: userId,
        acceptedAt: acceptedAt
      }

      const membershipsCollectionRef = collection(this.firestore, 'memberships')
      return addDoc(membershipsCollectionRef, membership)
    }

    return undefined
  }

}

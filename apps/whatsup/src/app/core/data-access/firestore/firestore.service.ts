import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, documentId, getDoc, Firestore, query, where, orderBy, DocumentReference, DocumentData, getDocs, deleteDoc, docData, updateDoc } from '@angular/fire/firestore';
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

  async deleteGroupMembership(groupId: string, userId: string, confirmationPrompt: string): Promise<void> {
    if(!confirm(confirmationPrompt)) {
      console.log('Gebruiker heeft deelname aan groep niet beeindigd')
      return Promise.resolve()
    }
    const membershipDocQuery = query(collection(this.firestore, 'memberships'), where("groupId", "==", groupId), where("contactId", "==", userId))
    const membershipDocs = await getDocs(membershipDocQuery)

    if(membershipDocs.empty) {
      console.warn(`Geen membership gevonden voor groupId: ${groupId} en userId: ${userId}`)
      throw new Error(`Geen membership gevonden voor groupId: ${groupId} en userId: ${userId}`)
    }
    
    await deleteDoc(membershipDocs.docs[0].ref)
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

  getContactsByGroup(groupId: string | undefined): Observable<Contact[]> {
    if (!groupId) {
      return of([]) as Observable<Contact[]>;
    }
    return (collectionData(query(collection(this.firestore, 'memberships'), where("groupId", "==", groupId)), {idField: 'id'}) as Observable<Membership[]>).pipe(
      switchMap((memberships: Membership[]): Observable<Contact[]> => {
        const userIds = memberships.map( (membership: Membership): string => membership.contactId);
        
        if(userIds.length === 0) {
          return of([]) as Observable<Contact[]>
        }

        return collectionData(
          query(collection(this.firestore, 'contacts'), where(documentId(), "in", userIds)), {idField: 'id'}) as Observable<Contact[]>
      })
    )
  }

  getGroup(groupId: string): Observable<Group>{
    const groupDocRef = doc(this.firestore, `groups/${groupId}`);
    return docData(groupDocRef) as Observable<Group>;
  }

  getGroups(): Observable<Group[]> {
    const groupsRef = collection(this.firestore, 'groups');
    return collectionData(groupsRef, { idField: 'id' }) as Observable<Group[]>;    
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

  getMembershipsByGroupId(groupId: string): Observable<Membership[]> {
    const membershipQuery = query(collection(this.firestore, 'memberships'), where("groupId", "==", groupId));
    return collectionData(membershipQuery, {idField: 'id'}) as Observable<Membership[]>
  }
  
  getMessagesByGroup(id: string | undefined): Observable<Message[]> {
    if(!id) {
      return of([]) as Observable<Message[]>
    }
    
    return (collectionData(
      query(collection(this.firestore, 'messages'), where("groupId", "==", id), orderBy('timeStamp', 'asc')), {idField: 'id'}) as Observable<Message[]>).pipe(
        switchMap((messages: Message[]): Observable<Message[]> => {
          const senderIds = [...new Set (messages.map((message: Message): string => message.sender))];

          if(senderIds.length === 0) {
            return of([]) as Observable<Message[]>
          }
          
          return (collectionData(
          query(collection(this.firestore, 'contacts'), where(documentId(), "in", senderIds)), {idField: 'id'}) as Observable<Contact[]>).pipe(
            map((contacts: Contact[]) => {

              const nameById = new Map(contacts.map((contact: Contact): [string, string] => [contact.id, contact.name]))

              return messages.map((message: Message): Message => ({
                ...message,
                sender: nameById.get(message.sender) ?? message.sender
              }))
            })
          )
      })
    )
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

  async updateGroup(groupId: string, group: Partial<Group>): Promise<void> {
    const groupDocRef = doc(this.firestore, `groups/${groupId}`);
    await updateDoc(groupDocRef, group);
  }

  async updateGroupInvitation(invitationId: string, groupId: string, status: 'accept' | 'decline', userId: string): Promise<DocumentReference<DocumentData, DocumentData> | void> {
    const invitationDocRef = doc(this.firestore, `groupInvitations/${invitationId}`)
    const createdAt = (await getDoc(invitationDocRef)).data()?.['createdAt']
  
    // verwijdeer invitationDoc uit de collectie
    await deleteDoc(invitationDocRef)

    // Bij status: accept: voeg een nieuwe membership document toe
    if(status === 'accept') {
      const membership = {
        acceptedAt: Temporal.Now.zonedDateTimeISO().toString(),
        contactId: userId,
        email: (await this.getContact(userId))?.email ?? '',
        groupId: groupId,
        invitedAt: createdAt
      } as unknown as Membership

      return this.addMembership(membership)
    }
  }

}

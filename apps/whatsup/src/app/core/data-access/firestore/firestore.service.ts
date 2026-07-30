import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, documentId, getDoc, Firestore, query, where, orderBy, writeBatch, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { Contact } from '../../../models/contact.model';
import { Message } from '../../../models/message.model';
import { Observable, firstValueFrom, of, switchMap } from 'rxjs';
import { StorageProvider } from '../storage-provider';
import { Group, Membership } from '../../../models';
import { Temporal } from 'temporal-polyfill';
import { GroupInvitation } from '../../../models/groupInvitation';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService implements StorageProvider{

  private firestore = inject(Firestore);

  acceptInvitation(invitation: GroupInvitation) {
    const batch = writeBatch(this.firestore)

    const invitationRef = doc(this.firestore, 'groupInvitations', invitation.id ?? '')
    batch.update(invitationRef, {
      status: 'accepted',
      acceptedAt: Temporal.Now.zonedDateTimeISO().toString
    })
  }

  async addGroup(group: Group): Promise<DocumentReference<DocumentData, DocumentData>> {
    const groupCollectionRef = collection(this.firestore, 'groups')
    return await addDoc(groupCollectionRef, group)
  }

        
  async addMessage(message: Message): Promise<void> {
    const messagesCollection = collection(this.firestore, 'messages')
    await addDoc(messagesCollection, message)
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
    const membershipQuery = query(collection(this.firestore, 'memberships'), where("groupId", "==", groupId), where("status","==","accepted"));

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
    const groupsRef = collection(this.firestore, 'memberships');
    const q = query(groupsRef, where("contactId","==", id))

    const result =  collectionData(q, { idField: 'id' }) as Observable<Group[]>;    
    
    return result;    
  }

  // Haal alle groepen op waarvoor de gebruiker is uitgenodigd op
  getPendingGroups(id: string): Observable<Group[]> {
    const groupInvitationsQuery = query(collection(this.firestore, 'groupInvitations'), where("toUserId", "==", id), where("status", "==", "pending"))
    
    return (collectionData(groupInvitationsQuery, {idField: 'id'}) as Observable<GroupInvitation[]>).pipe(
      switchMap((groupInvitations: GroupInvitation[]): Observable<Group[]> => {
        const groupIds = groupInvitations.map(groupInvitation => groupInvitation.groupId)

        if(!groupIds || groupIds.length == 0) {
          return of([]) as Observable<Group[]>
        }

      const groupsQuery = query(collection(this.firestore,'groups'), where(documentId(), "in", groupIds))

      return collectionData(groupsQuery, {idField: 'id'}) as Observable<Group[]>
      })
    )
  }

  getMessagesWithSelectedContact(id: string): Observable<Message[]> {
    const q = query(collection(this.firestore, 'messages'), where("conversationId", "==", id), orderBy('timeStamp', 'asc'))
    return collectionData (q, {idField: 'id'}) as Observable<Message[]>
  }

  async getUserIdByEmailAddress(email:string): Promise<string | undefined> {
    const q = query(collection(this.firestore,'contacts'), where('email','==',email))
    const contacts = await firstValueFrom(collectionData(q, {idField: 'id'}))

    return contacts[0]?.id
  }

  async updateGroupInvitations(contacts: Contact[], fromUserId: string, groupId: string) : Promise<DocumentReference<DocumentData, DocumentData>[]> {

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

  updateMembership(membership: Membership): Promise<DocumentReference<DocumentData, DocumentData>> {
    const membershipsCollectionRef = collection(this.firestore, 'memberships')
    return addDoc(membershipsCollectionRef, membership)
  }

}

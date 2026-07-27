import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, documentId, getDoc, Firestore, query, where, orderBy } from '@angular/fire/firestore';
import { Contact } from '../../../models/contact.model';
import { Message } from '../../../models/message.model';
import { Observable, firstValueFrom, from, map, of, switchMap } from 'rxjs';
import { StorageProvider } from '../storage-provider';
import { AddGroupResult, Group, Membership } from '../../../models';
import { Temporal } from 'temporal-polyfill';
import { GroupInvitation } from '../../../models/groupInvitation';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService implements StorageProvider{

  private firestore = inject(Firestore);

  addGroup(group: Group & {invitedContactsEmails: string[], currentContactId: string}): Observable<AddGroupResult> {
    const groupCollectionRef = collection(this.firestore, 'groups')
    return from(addDoc(groupCollectionRef, {createdAt: group.createdAt, description: group.description, name: group.name}))
    .pipe(
      switchMap(g => {
        const groupMembershipCollectionRef = collection(this.firestore, 'groupInvitations');
        const createdAt = Temporal.Now.zonedDateTimeISO().toString();
        const fromUserId = group.currentContactId;

        if (!group.invitedContactsEmails || group.invitedContactsEmails.length === 0) {
          // er zijn geen users uitgenodigd om deel te nemen aan deze groep, return alleen de group
          return of({
            id: g.id, ...group,
            failedEmails: []
          } as unknown as AddGroupResult);
        }

        // vind voor alle emailadressen de userId
        const resolvedEmails = group.invitedContactsEmails.map(async (email: string) => {
          const userId = await this.getUserIdByEmailAddress(email)
          return {email, userId}
        })

        return from(Promise.all(resolvedEmails)).pipe(
          switchMap(results => {
            const succeeded = results.filter(r => r.userId !== undefined && r.userId !== group.currentContactId)
            const failedEmails = results.filter(r => r.userId == undefined).map(r => r.email)
            const invitationPromises = succeeded.map(async r => {
              const invitation = {
                acceptedAt: '',
                createdAt: createdAt,
                fromUserId: fromUserId,
                groupId: g.id,
                status: 'pending',
                toUserId: r.userId
              } as GroupInvitation;
              return addDoc(groupMembershipCollectionRef, invitation);
            })

            return from(Promise.all(invitationPromises)).pipe(
              map(() => (
                {
                  group: {id: g.id, ...group} as unknown as Group,
                  failedEmails
                }
              ))
            )
          })
        )
      })
    );
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
    return { ...(data as Contact), id: (snap.id as string) } as Contact;
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

  getContacts(): Observable<Contact[]> {
    const contactsRef = collection(this.firestore, 'contacts');
    return collectionData(contactsRef, { idField: 'id' }) as Observable<Contact[]>;    
  }

  getGroups(): Observable<Group[]> {
    const groupsRef = collection(this.firestore, 'groups');
    return collectionData(groupsRef, { idField: 'id' }) as Observable<Group[]>;    
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

}

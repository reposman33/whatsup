import { Contact, Group, Membership } from '../../models';
import { Message } from '../../models';
import { Observable } from 'rxjs';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';

export abstract class StorageProvider {

  abstract addGroup(group: Group): Promise<DocumentReference<DocumentData, DocumentData>>

  abstract addGroupInvitations(contacts: Contact[], fromUserId: string, groupId: string): Promise<DocumentReference<DocumentData, DocumentData>[]>

  abstract addMembership(membership: Membership): Promise<DocumentReference<DocumentData, DocumentData>>

  abstract addMessage(message: Message): void

  abstract getContact(id: string): Promise<Contact | undefined>
  
  abstract getContacts(): Observable<Contact[]>

  abstract getContactsByGroup(groupId: string): Observable<Contact[]>
  
  abstract getGroupsForContact(id: string): Observable<Group[]>

  abstract getMessagesWithSelectedContact(id: string): Observable<Message[]>

  abstract getPendingGroups(userId: string): Observable<(Group & {invitationId: string})[]>

  abstract updateGroupInvitation(invitationId: string, groupId: string, status: 'accept' | 'decline', userId: string): void

}

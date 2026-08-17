import { Contact, Group, Membership } from '../../models';
import { Message } from '../../models';
import { Observable } from 'rxjs';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';

export abstract class StorageProvider {

  abstract addGroup(group: Group): Promise<DocumentReference<DocumentData, DocumentData>>

  abstract addGroupInvitations(contacts: Contact[], fromUserId: string, groupId: string): Promise<DocumentReference<DocumentData, DocumentData>[]>

  abstract addMembership(membership: Membership): Promise<DocumentReference<DocumentData, DocumentData>>

  abstract addMessage(message: Message): void

  abstract deleteGroupMembership(groupId: string, userId: string, confirmationPrompt: string): Promise<void>

  abstract getContact(id: string): Promise<Contact | undefined>
  
  abstract getContacts(): Observable<Contact[]>

  abstract getContactsByGroup(groupId: string | undefined): Observable<Contact[]>
  
  abstract getGroup(groupId: string): Observable<Group>

  abstract getGroupsForContact(id: string): Observable<Group[]>

  abstract getMembershipsByGroupId(groupId: string): Observable<Membership[]>

  abstract getMessagesByGroup(id: string | undefined): Observable<Message[]>

  abstract getPendingGroups(userId: string): Observable<(Group & {invitationId: string})[]>

  abstract updateGroup(groupId: string, group: Partial<Group>): void
  
  abstract updateGroupInvitation(invitationId: string, groupId: string, status: 'accept' | 'decline', userId: string): void

}

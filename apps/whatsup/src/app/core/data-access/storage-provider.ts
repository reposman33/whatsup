import { Contact, Group, Membership } from '../../models';
import { Message } from '../../models';
import { Observable } from 'rxjs';
import { GroupInvitation } from '../../models/groupInvitation';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';

export abstract class StorageProvider {

  abstract acceptInvitation(invitation: GroupInvitation): void

  abstract addGroup(group: Group): Promise<DocumentReference<DocumentData, DocumentData>>

  abstract addMessage(message: Message): void

  abstract getContact(id: string): Promise<Contact | undefined>
  
  abstract getContacts(): Observable<Contact[]>

  abstract getContactsByGroup(groupId: string): Observable<Contact[]>
  
  abstract getGroupsForContact(id: string): Observable<Group[]>

  abstract getMessagesWithSelectedContact(id: string): Observable<Message[]>

  abstract getPendingGroups(id: string): Observable<Group[]>

  abstract updateMembership(membership: Membership): void

}

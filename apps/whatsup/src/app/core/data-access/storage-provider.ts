import { AddGroupResult, Contact, Group } from '../../models';
import { Message } from '../../models';
import { Observable } from 'rxjs';

export abstract class StorageProvider {

  abstract getContact(id: string): Promise<Contact | undefined>
  
  abstract getContacts(): Observable<Contact[]>

  abstract getContactsByGroup(groupId: string): Observable<Contact[]>

  abstract addMessage(message: Message): void
  
  abstract getMessagesWithSelectedContact(id: string): Observable<Message[]>

  abstract addGroup(group: Group & {invitedContactsEmails: string[]}): Observable<AddGroupResult>

  abstract getGroups(): Observable<Group[]>

  abstract getPendingGroups(id: string): Observable<Group[]>

}

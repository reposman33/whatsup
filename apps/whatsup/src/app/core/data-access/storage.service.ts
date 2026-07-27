import { inject, Injectable } from '@angular/core';
import { AddGroupResult, Contact, Group } from '../../models';
import { Message } from '../../models';
import { StorageProvider } from './storage-provider';
import { Observable } from 'rxjs';
import { GroupInvitation } from '../../models/groupInvitation';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageProvider = inject(StorageProvider)

  acceptInvitation(invitation: GroupInvitation) {}
  
  getContact(id: string): Promise<Contact | undefined> {
    return this.storageProvider.getContact(id);
  }

  getContacts(): Observable<Contact[]> {
    return this.storageProvider.getContacts()
  }

  getContactsByGroup(groupId: string): Observable<Contact[]> {
    return this.storageProvider.getContactsByGroup(groupId)
  }

  addMessage(message: Message) {
    this.storageProvider.addMessage(message)
  }

  getMessagesWithSelectedContact(id: string): Observable<Message[]> {
    return this.storageProvider.getMessagesWithSelectedContact(id)
  }
  
  addGroup(group: Group & {invitedContactsEmails: string[], currentContactId: string}): Observable<AddGroupResult> {
    return this.storageProvider.addGroup(group)
  }
  
  getGroups(): Observable<Group[]> {
    return this.storageProvider.getGroups()
  }

  getPendingGroups(id: string): Observable<Group[]> {
    return this.storageProvider.getPendingGroups(id)
  }
  
}

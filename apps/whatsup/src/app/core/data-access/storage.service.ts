import { inject, Injectable } from '@angular/core';
import { Contact, Group } from '../../models';
import { Message } from '../../models';
import { StorageProvider } from './storage-provider';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageProvider = inject(StorageProvider)

  getContact(id: string): Promise<Contact | undefined> {
    return this.storageProvider.getContact(id);
  }

  getContacts(): Observable<Contact[]> {
    return this.storageProvider.getContacts()
  }

  addMessage(message: Message) {
    this.storageProvider.addMessage(message)
  }

  getMessagesWithSelectedContact(id: string): Observable<Message[]> {
    return this.storageProvider.getMessagesWithSelectedContact(id)
  }
  
  addGroup(group: Group): Observable<Group> {
    return this.storageProvider.addGroup(group)
  }
  
}

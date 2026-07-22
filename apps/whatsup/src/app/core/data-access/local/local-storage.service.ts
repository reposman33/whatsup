import { Injectable } from '@angular/core';
import { Contact } from '../../../models/contact.model';
import { Message } from '../../../models/message.model';
import { StorageProvider } from '../storage-provider';
import { isContact } from '../../../shared/type-guards';
import { Observable, of } from 'rxjs';
import { Group } from '../../../models';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService extends StorageProvider {

  getContact(id: string): Promise<Contact | undefined> {
    const contact = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    .find((contact: Contact & Pick<{password: string}, 'password'>) => contact.id === id);
    if(contact) {
      // check met TypeGuard of dit echt een valide Contact object is
      return Promise.resolve(isContact(contact) ? contact : undefined)
    }
    return Promise.resolve(undefined)
  }

  getContacts(): Observable<Contact[]> {
    return of(
      JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    .map((c: Contact) => c)
   )
  }

  getContactsByGroup(groupId: string): Observable<Contact[]> {
    return of([]) as Observable<Contact[]>
  }
  
  addMessage(message: Message){
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push( message );
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  getMessagesWithSelectedContact(id: string): Observable<Message[]>{
    return of (
      JSON.parse(localStorage.getItem('messages') || '[]')
      // filter alle chats van ingelogde gebruiker naar geselecteerde contact en omgekeerd
      .filter((m: Message) => (m.conversationId === id))
    )
  }

  addGroup(group: Group): Observable<Group> {
    const groups  = JSON.parse(localStorage.getItem('groups') || '[]')
    group.id = group.name.split('').reverse().join('').replace(/\s+/g, '')
    groups.push(group)

    return of(group)
  }

  getGroups(): Observable<Group[]> {
    return of([]) as Observable<Group[]>
  }
}

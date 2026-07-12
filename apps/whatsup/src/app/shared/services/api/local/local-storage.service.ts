import { Injectable } from '@angular/core';
import { Contact } from '@models/contact';
import { Message } from '@models/message';
import { StorageService } from '@services/api/storage.service';
import { isContact } from '@typeGuards';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService extends StorageService {

  getContact(email: string, password: string): Contact & Pick<{password: string}, 'password'> | undefined {
    const contact = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    .find((contact: Contact & Pick<{password: string}, 'password'>) => contact.email === email && contact.password === password);
    if(contact) {
      // check met TypeGuard of dit echt een valide Contact object is
      return isContact(contact) ? contact : undefined
    }
    return undefined
  }

  getContacts(): Observable<Contact[]> {
    return of(
      JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    .map((c: Contact) => c)
  )
  }
  
  registerContact(contact: Contact) {
    const registeredContacts = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredContacts.push(contact);
  
    localStorage.setItem('registeredUsers', JSON.stringify(registeredContacts));
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
}

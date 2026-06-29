import { Injectable } from '@angular/core';
import { Contact } from '@models/contact';
import { Message } from '@models/message';
import { StorageService } from '@services/storage/storage.service';
import { isContact } from '@typeGuards';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService extends StorageService {

  addContact(contact: Contact) {
    const registeredContacts = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredContacts.push(contact);
  
    localStorage.setItem('registeredUsers', JSON.stringify(registeredContacts));
  }

  addMessage(message: Message){
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push( message );
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  getConversationsWithContact(currentContactRegistrationTime: number, selectedContactRegistrationTime: number): Message[]{
    return JSON.parse(localStorage.getItem('messages') || '[]')
    .filter((m: Message) => m.sender === currentContactRegistrationTime && m.receiver === selectedContactRegistrationTime)
  }

  /**
   * 
   * @param email 
   * @param password 
   * @returns - een Contact object of undefined. Check op type Contact met een typeGuard
   */
  getContact(email: string, password: string): Contact | undefined {
    const contact = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    .find((contact: Contact) => contact.email === email && contact.password === password);
    if(contact) {
      // check met TypeGuard of dit echt een valide Contact object is
      return isContact(contact) ? contact : undefined
    }
    return undefined
  }

  getContacts(): Contact[] {
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    .map((c: Contact) => c)
  }
  
}

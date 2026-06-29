import { Injectable } from '@angular/core';
import { Contact } from '@models/contact';
import { Message } from '@models/message';
import { isContact } from '@typeGuards/';

type loginMethod = 'localstorage' | 'firebase';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private storage: loginMethod = 'localstorage';

  registerContact(contact: Contact) {
    switch (this.storage) {
      case 'localstorage': {
        this.addContactToLocalStorage(contact);
        break;
      }
      case 'firebase': {
        // ...
        break;
      }
    }
  }

  getContact(email: string, password: string): Contact | undefined {
    switch (this.storage) {
      case 'localstorage': {
        return this.getContactFromLocalStorage(email, password);
      }
    }
    return undefined
  }

  getContacts(): Contact[] | [] {
    switch (this.storage) {
      case 'localstorage': {
        return JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      }
      case 'firebase': {
        // ...
        break;
      }
    }

    return [];
  }

  /**
   * @description: sla een Message op in de conversaties. Alle conversaties van alle deelnemers worden in een array opgeslagen 
   * @param message 
   */
  addMessage(message: Message) {
    switch (this.storage) {
      case 'localstorage': {
        this.addMessageToLocalStorage(message)
        break;
      }
      case 'firebase': {
        //...
        break;
      }
    }
  }

  getConversationWithContact(currentContactRegistrationTime: number, selectedContactRegistrationTime: number): Message[] {
    switch (this.storage) {
      case 'localstorage': {
        return this.getConversationsWithContactFromLocalStorage(currentContactRegistrationTime, selectedContactRegistrationTime)
        break;
      }
      case 'firebase': {
        //...
        break;
      }
    }

    return [] as Message[]
  }

  getConversationsWithContactFromLocalStorage(currentContactRegistrationTime: number, selectedContactRegistrationTime: number): Message[]{
    return JSON.parse(localStorage.getItem('messages') || '[]')
    .filter((m: Message) => m.sender === currentContactRegistrationTime && m.receiver === selectedContactRegistrationTime)
  }

  addContactToLocalStorage(contact: Contact) {
    const registeredContacts = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredContacts.push(contact);
  
    localStorage.setItem('registeredUsers', JSON.stringify(registeredContacts));
  }

  addMessageToLocalStorage(message: Message){
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push( message );
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  /**
   * 
   * @param email 
   * @param password 
   * @returns - een Contact object of undefined. Check op type Contact met een typeGuard
   */
  getContactFromLocalStorage(email: string, password: string): Contact | undefined {
    const contact = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    .find((contact: Contact) => contact.email === email && contact.password === password);
    if(contact) {
      // check met TypeGuard of dit echt een valide Contact object is
      return isContact(contact) ? contact : undefined
    }
    return undefined
  }
    
}

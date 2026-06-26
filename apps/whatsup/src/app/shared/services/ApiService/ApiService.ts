import { Injectable } from '@angular/core';
import { Contact } from '@models/contact';
import { Message } from '@models/message';
import { BehaviorSubject } from 'rxjs';
import { isContact } from '@typeGuards/';

type loginMethod = 'localstorage' | 'firebase';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private storage: loginMethod = 'localstorage';
  private registeredContactsBehaviorSubject = new BehaviorSubject<Contact[]>([])

  registeredContacts$ = this.registeredContactsBehaviorSubject.asObservable()

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

  deleteContact(registrationTime: number) {
    switch (this.storage) {
      case 'localstorage': {
        this.deleteContactFromLocalStorage(registrationTime);
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
        this.registeredContactsBehaviorSubject.next(JSON.parse(localStorage.getItem('registeredUsers') || '[]'))
        break
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

  deleteContactFromLocalStorage(registrationTime: number) {
    const registeredContacts = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    localStorage.setItem('registeredUsers',JSON.stringify(registeredContacts.filter((contact: Contact) => contact.registrationTime !== registrationTime)))
  }
    
}

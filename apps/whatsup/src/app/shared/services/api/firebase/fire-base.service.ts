import { Injectable } from '@angular/core';
import { Contact } from '@models/contact';
import { Message } from '@models/message';

@Injectable({
  providedIn: 'root',
})
export class FireBaseService {

  getContact(email: string, password: string): Contact | undefined {
    return undefined
  }

  getContacts(): Contact[] {
    return []
  }

  registerContact(contact: Contact): void {}  
  
  addMessage(message: Message): void {}
  
    getMessagesWithContact(currentContactRegistrationTime: number, selectedContactRegistrationTime: number): Message[] {
    return []
  }
}

import { inject, Injectable } from '@angular/core';
import { Contact } from '@models/contact';
import { Message } from '@models/message';
import { StorageService } from '@services/api/storage.service';

type loginMethod = 'localstorage' | 'firebase';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private storageService = inject(StorageService)

  getContact(email: string, password: string): Contact | undefined {
    return this.storageService.getContact(email, password);
  }

  getContacts(): Contact[] {
    return this.storageService.getContacts()
  }

  registerContact(contact: Contact) {
    this.storageService.registerContact(contact);
  }

  addMessage(message: Message) {
    this.storageService.addMessage(message)
  }

  getMessagesWithContact(currentContactRegistrationTime: number, selectedContactRegistrationTime: number): Message[] {
    return this.storageService.getMessagesWithContact(currentContactRegistrationTime, selectedContactRegistrationTime)
  }    
}

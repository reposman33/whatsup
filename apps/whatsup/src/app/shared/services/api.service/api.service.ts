import { inject, Injectable } from '@angular/core';
import { Contact } from '@models/contact';
import { Message } from '@models/message';
import { StorageService } from '@services/storage/storage.service';

type loginMethod = 'localstorage' | 'firebase';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private storageService = inject(StorageService)

  registerContact(contact: Contact) {
    this.storageService.addContact(contact);
  }

  getContact(email: string, password: string): Contact | undefined {
    return this.storageService.getContact(email, password);
  }

  getContacts(): Contact[] {
    return this.storageService.getContacts()
  }

  /**
   * @description: sla een Message op in de conversaties. Alle conversaties van alle deelnemers worden in een array opgeslagen 
   * @param message 
   */
  addMessage(message: Message) {
    this.storageService.addMessage(message)
  }

  getConversationWithContact(currentContactRegistrationTime: number, selectedContactRegistrationTime: number): Message[] {
    return this.storageService.getConversationsWithContact(currentContactRegistrationTime, selectedContactRegistrationTime)
  }    
}

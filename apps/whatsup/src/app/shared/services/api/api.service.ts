import { inject, Injectable } from '@angular/core';
import { Contact } from '@models/contact';
import { Message } from '@models/message';
import { StorageService } from '@services/api/storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private storageService = inject(StorageService)

  getContact(email: string, password: string): Contact | undefined {
    return this.storageService.getContact(email, password);
  }

  getContacts(): Observable<Contact[]> {
    return this.storageService.getContacts()
  }

  registerContact(contact: Contact) {
    this.storageService.registerContact(contact);
  }

  addMessage(message: Message) {
    this.storageService.addMessage(message)
  }

  getMessagesWithContact(id: string): Observable<Message[]> {
    return this.storageService.getMessagesWithContact(id)
  }    
}

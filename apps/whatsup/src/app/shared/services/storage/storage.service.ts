import { Contact } from '@models/contact';
import { Message } from '@models/message';

export abstract class StorageService {

  abstract getConversationsWithContact(currentContactRegistrationTime: number, selectedContactRegistrationTime: number): Message[]

  abstract addContact(contact: Contact): void

  abstract addMessage(message: Message): void

  abstract getContact(email: string, password: string): Contact | undefined
  
  abstract getContacts(): Contact[]

}

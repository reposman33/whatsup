import { Contact } from '@models/contact';
import { Message } from '@models/message';

export abstract class StorageService {

  abstract getContact(email: string, password: string): Contact | undefined
  
  abstract getContacts(): Contact[]

  abstract registerContact(contact: Contact): void
  
  abstract addMessage(message: Message): void
  
  abstract getMessagesWithContact(currentContactRegistrationTime: number, selectedContactRegistrationTime: number): Message[]

}

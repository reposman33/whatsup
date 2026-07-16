import { Contact } from '../../models';
import { Message } from '../../models';
import { Observable } from 'rxjs';

export abstract class StorageProvider {

  abstract getContact(id: string): Promise<Contact | undefined>
  
  abstract getContacts(): Observable<Contact[]>

  abstract addMessage(message: Message): void
  
  abstract getMessagesWithSelectedContact(id: string): Observable<Message[]>

}

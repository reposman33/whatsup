import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, getDoc, Firestore } from '@angular/fire/firestore';
import { Contact } from '@models/contact';
import { Message } from '@models/message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FireBaseService {

private firestore = inject(Firestore);

async getContact(id: string): Promise<Contact | undefined> {
    const docRef = doc(this.firestore, `contacts/${id}`);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return undefined;
    const data = snap.data() as Contact;

    // attach id if needed
    return { ...(data as Contact), id: (snap.id as any) } as Contact;
  }

  getContacts(): Observable<Contact[]> {
    const contactsRef = collection(this.firestore, 'contacts');
    return collectionData(contactsRef, { idField: 'id' }) as Observable<Contact[]>;    
  }

  registerContact(contact: Contact): void {
    throw new Error('Method not implemented.');
  }
  
  addMessage(message: Message): void {
    throw new Error('Method not implemented.');
  }
  
  getMessagesWithContact(currentContactRegistrationTime: number, selectedContactRegistrationTime: number): Message[] {
    throw new Error('Method not implemented.');
  }
}

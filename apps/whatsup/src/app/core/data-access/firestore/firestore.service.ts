import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, getDoc, Firestore, query, where, orderBy } from '@angular/fire/firestore';
import { Contact } from '../../../models/contact.model';
import { Message } from '../../../models/message.model';
import { Observable, from, map } from 'rxjs';
import { StorageProvider } from '../storage-provider';
import { Group } from '../../../models';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService implements StorageProvider{

  private firestore = inject(Firestore);

  async getContact(id: string): Promise<Contact | undefined> {
    const docRef = doc(this.firestore, `contacts/${id}`);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return undefined;
    const data = await snap.data() as Contact;

    // attach id if needed
    return { ...(data as Contact), id: (snap.id as string) } as Contact;
  }

  getContacts(): Observable<Contact[]> {
    const contactsRef = collection(this.firestore, 'contacts');
    return collectionData(contactsRef, { idField: 'id' }) as Observable<Contact[]>;    
  }
  
  async addMessage(message: Message): Promise<void> {
    const messagesCollection = collection(this.firestore, 'messages')
    await addDoc(messagesCollection, message)
  }
  
  getMessagesWithSelectedContact(id: string): Observable<Message[]> {
    const q = query(collection(this.firestore, 'messages'), where("conversationId", "==", id), orderBy('timeStamp', 'asc'))

    return collectionData (q, {idField: 'id'}) as Observable<Message[]>
  }

  addGroup(group: Group): Observable<Group> {
    const groupCollection = collection(this.firestore, 'groups')
    return from(addDoc(groupCollection, group)).pipe(
      map(groupRef => ({ ...group, id: groupRef.id } as Group))
    );
  }
}

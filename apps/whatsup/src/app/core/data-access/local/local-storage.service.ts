import { Injectable } from '@angular/core';
import { Contact } from '../../../models/contact.model';
import { Message } from '../../../models/message.model';
import { StorageProvider } from '../storage-provider';
import { isContact } from '../../../shared/type-guards';
import { Observable, of } from 'rxjs';
import { Group, Membership } from '../../../models';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService extends StorageProvider {

  async addGroup(group: Group): Promise<DocumentReference<DocumentData, DocumentData>> {
    return await({} as DocumentReference<DocumentData, DocumentData>)
  }

  async addGroupInvitations(contacts: Contact[], fromUserId: string, groupId: string) : Promise<DocumentReference<DocumentData, DocumentData>[]> {
    return [] as DocumentReference<DocumentData, DocumentData>[];
  }

  async addMembership(membership: Membership): Promise<DocumentReference<DocumentData, DocumentData>> {
    return await ({} as DocumentReference<DocumentData, DocumentData>) 
  }

  addMessage(message: Message){
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push( message );
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  getContact(id: string): Promise<Contact | undefined> {
    const contact = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    .find((contact: Contact & Pick<{password: string}, 'password'>) => contact.id === id);
    if(contact) {
      // check met TypeGuard of dit echt een valide Contact object is
      return Promise.resolve(isContact(contact) ? contact : undefined)
    }
    return Promise.resolve(undefined)
  }

  getContacts(): Observable<Contact[]> {
    return of(
      JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    .map((c: Contact) => c)
   )
  }

  getContactsByGroup(groupId: string): Observable<Contact[]> {
    return of([]) as Observable<Contact[]>
  }
  
  getGroupsForContact(id: string): Observable<Group[]> {
    return of([]) as Observable<Group[]>
  }

  getGroups(): Observable<Group[]> {
    return of([]) as Observable<Group[]>
  }

  getPendingGroups(userId: string): Observable<(Group & {invitationId: string})[]> {
    return of([]) as Observable<(Group & {invitationId: string})[]>
  }

  getMessagesWithSelectedContact(id: string): Observable<Message[]>{
    return of (
      JSON.parse(localStorage.getItem('messages') || '[]')
      // filter alle chats van ingelogde gebruiker naar geselecteerde contact en omgekeerd
      .filter((m: Message) => (m.conversationId === id))
    )
  }

  getUserIdByEmailAddress(email:string): Promise<string | undefined> {
    return Promise.resolve('12345') 
  }

  updateGroupInvitation(invitationId: string, groupId: string, status: 'accept' | 'decline', userId: string): void {}

}

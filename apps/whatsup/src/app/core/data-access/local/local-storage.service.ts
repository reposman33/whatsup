import { Injectable } from '@angular/core';
import { Contact } from '../../../models/contact.model';
import { Message } from '../../../models/message.model';
import { StorageProvider } from '../storage-provider';
import { isContact } from '../../../shared/type-guards';
import { Observable, of } from 'rxjs';
import { AddGroupResult, Group, Membership } from '../../../models';
import { GroupInvitation } from '../../../models/groupInvitation';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService extends StorageProvider {

  acceptInvitation(invitation: GroupInvitation) {}

  addGroup(group: Group & {invitedContactsEmails: string[], currentContactId: string}): Observable<AddGroupResult> {
    return of() as Observable<AddGroupResult>
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
  
  getGroups(): Observable<Group[]> {
    return of([]) as Observable<Group[]>
  }

  getPendingGroups(id: string): Observable<Group[]> {
    return of([]) as Observable<Group[]>
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

  updateMembership(membership: Membership): void {
  }


}

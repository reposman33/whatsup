import { inject, Injectable } from '@angular/core';
import { Contact, Group, Membership } from '../../models';
import { Message } from '../../models';
import { StorageProvider } from './storage-provider';
import { Observable } from 'rxjs';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageProvider = inject(StorageProvider)

  addGroup(group: Group): Promise<DocumentReference<DocumentData, DocumentData>> {
    return this.storageProvider.addGroup(group)
  }
  
  async addGroupInvitations(selectedContacts: Contact[], fromUserId: string, groupId: string) : Promise<DocumentReference<DocumentData, DocumentData>[]> {
    return this.storageProvider.addGroupInvitations(selectedContacts, fromUserId, groupId)
  }
  
  addMembership(membership: Membership): Promise<DocumentReference<DocumentData, DocumentData>> {
    return this.storageProvider.addMembership(membership)
  }

  addMessage(message: Message) {
    this.storageProvider.addMessage(message)
  }

  getContact(id: string): Promise<Contact | undefined> {
    return this.storageProvider.getContact(id);
  }

  getContacts(): Observable<Contact[]> {
    return this.storageProvider.getContacts()
  }

  getContactsByGroup(groupId: string): Observable<Contact[]> {
    return this.storageProvider.getContactsByGroup(groupId)
  }

  getGroupsForContact(id: string): Observable<Group[]> {
    return this.storageProvider.getGroupsForContact(id)
  }

  getMessagesWithSelectedContact(id: string): Observable<Message[]> {
    return this.storageProvider.getMessagesWithSelectedContact(id)
  }
  
  getPendingGroups(userid: string): Observable<(Group & {invitationId: string})[]> {
    return this.storageProvider.getPendingGroups(userid)
  }

  updateGroupInvitation(invitationId: string, groupId: string, status: 'accept' | 'decline', userId: string): void{
    this.storageProvider.updateGroupInvitation(invitationId, groupId, status, userId)
  }

}

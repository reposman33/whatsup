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

  deleteGroupMembership(groupId: string, userId: string, confirmationPrompt: string): Promise<void> {
    return this.storageProvider.deleteGroupMembership(groupId, userId, confirmationPrompt);
  }

  getContact(id: string): Promise<Contact | undefined> {
    return this.storageProvider.getContact(id);
  }

  getContacts(): Observable<Contact[]> {
    return this.storageProvider.getContacts()
  }

  getContactsByGroup(groupId: string | undefined): Observable<Contact[]> {
    return this.storageProvider.getContactsByGroup(groupId)
  }
  getGroup(groupId: string): Observable<Group>{
    return this.storageProvider.getGroup(groupId)
  }

  getGroupsForContact(id: string): Observable<Group[]> {
    return this.storageProvider.getGroupsForContact(id)
  }

  getMembershipsByGroupId(groupId: string): Observable<Membership[]> {
    return this.storageProvider.getMembershipsByGroupId(groupId)
  }

  getMessagesByGroup(id: string | undefined): Observable<Message[]> {
    return this.storageProvider.getMessagesByGroup(id)
  }
  
  getPendingGroups(userid: string): Observable<(Group & {invitationId: string})[]> {
    return this.storageProvider.getPendingGroups(userid)
  }

  updateGroup(groupId: string, group: Partial<Group>): void{
    this.storageProvider.updateGroup(groupId, group)
  }

  updateGroupInvitation(invitationId: string, groupId: string, status: 'accept' | 'decline', userId: string): void{
    this.storageProvider.updateGroupInvitation(invitationId, groupId, status, userId)
  }

}

import { inject, Injectable, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Message } from '../../../models/message.model';
import { StorageService } from '../../../core/data-access/storage.service';
import { AuthService } from '../../auth/data-access/auth.service';
import { Temporal } from 'temporal-polyfill'
import { Contact } from '../../../models';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private storageService = inject(StorageService)
  private authService = inject(AuthService)
  private router = inject(Router)

  public conversation = signal<Message[]>([])
  public selectedGroupId = signal<string | undefined>(undefined)

  public messages: ResourceRef<Message[] | undefined> = rxResource({
    params: () => ({
        selectedGroupId: this.selectedGroupId()
      }),
    stream: ({ params }):Observable<Message[]> => params.selectedGroupId
    ? this.storageService.getMessagesByGroup(params.selectedGroupId)
    : of([]) as Observable<Message[]>
  });
  
  public contacts: ResourceRef<Contact[] | undefined> = rxResource({
    params: () => (
      {selectedGroupId: this.selectedGroupId()}
    ),
    stream: ({ params }): Observable<Contact[]> => params.selectedGroupId
    ? this.storageService.getContactsByGroup(params.selectedGroupId).pipe(
      // niet mezelf tonen als lid van deze groep...
      map(contacts => contacts.filter(contact => contact.id !== this.authService.currentContact()?.id))
    )
    : of([]) as Observable<Contact[]>
  });

  processMessage(chat: string | undefined) {
    // maak een Message object
    const message = {
      content: chat,
      groupId: this.selectedGroupId(),
      sender: this.authService.currentContact()?.id || '',
      timeStamp: Temporal.Now.instant().toString(),
    }
    this.storageService.addMessage(message as unknown as Message)
    this.conversation.update(prev => [...prev, message as unknown as Message])
  }

  getConversationId(senderID: string, receiverID: string) {
    return [senderID,receiverID].sort().join('_')
  }

  logout() {
    this.authService.logout()
    this.selectedGroupId.set(undefined)
    this.conversation.set([])

    this.router.navigate(['/login'])
  }
}

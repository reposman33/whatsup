import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Message } from '../../../models/message.model';
import { StorageService } from '../../../core/data-access/storage.service';
import { AuthService } from '../../auth/data-access/auth.service';
import { Temporal } from 'temporal-polyfill'
import { Observable } from 'rxjs';
import { Contact } from '../../../models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private storageService = inject(StorageService)
  private authService = inject(AuthService)
  private router = inject(Router)

  public conversation = signal<Message[]>([])
  public selectedContactId = signal('')
  public selectedGroupId = signal('')
  
  public contacts = rxResource({
    params: () => {
      const groupId = this.selectedGroupId()

      if(groupId === '') {
        return undefined
      }

      return {
        selectedGroupId: groupId
      };
    },
    stream: ({ params }): Observable<Contact[]> => this.storageService.getContactsByGroup(params.selectedGroupId)
  });
  
  public messages = rxResource({
    params: () => {
      return {
        current: this.authService.currentContact()?.id,
        selected: this.selectedContactId()
      };
    },
    stream: ({ params }) => this.storageService.getMessagesWithSelectedContact(
      this.getConversationId(params.current ?? '', params.selected)
    )
  });
  
  processMessage(chat: string) {
    // maak een Message object
    const message = {
      content: chat,
      conversationId: this.getConversationId(this.authService.currentContact()?.id || '', this.selectedContactId()),
      groupId: '',
      receiver: this.selectedContactId(),
      sender: this.authService.currentContact()?.id || '',
      timeStamp: Temporal.Now.instant().toString(),
    }
    this.storageService.addMessage(message as Message)
    this.conversation.update(prev => [...prev, message as Message])
  }

  getConversationId(senderID: string, receiverID: string) {
    return [senderID,receiverID].sort().join('_')
  }

  logout() {
    this.authService.logout()
    this.selectedContactId.set('')
    this.conversation.set([])

    this.router.navigate(['/login'])
  }
}

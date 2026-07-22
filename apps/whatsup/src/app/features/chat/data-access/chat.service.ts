import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Contact } from '../../../models/contact.model';
import { Message } from '../../../models/message.model';
import { StorageService } from '../../../core/data-access/storage.service';
import { AuthService } from '../../auth/data-access/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Temporal } from 'temporal-polyfill'

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private storageService = inject(StorageService)
  private authService = inject(AuthService)
  private router = inject(Router)

  public conversation = signal<Message[]>([])
  public selectedContactId = signal('')
  
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

  getContacts(): Observable<Contact[]> {
    // haal contacten op en filter de ingelogde gebruiker uit de lijst
    return this.storageService.getContacts()
    .pipe(
      map(contacts => contacts.filter(contact => contact.registrationTime !== this.authService.currentContact()?.registrationTime)),
    )
  }

  processMessage(chat: string) {
    // maak een Message object
    const message = {
      timeStamp: Temporal.Now.instant().toString(),
      sender: this.authService.currentContact()?.id || '',
      receiver: this.selectedContactId(),
      conversationId: this.getConversationId(this.authService.currentContact()?.id || '', this.selectedContactId()),
      content: chat
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

import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Contact } from '@models/contact';
import { Message } from '@models/message';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiService = inject(ApiService)
  private authService = inject(AuthService)
  private router = inject(Router)

  public conversation = signal<Message[]>([])
  public selectedContactRegistrationTime = signal(0)
  
  public messages = rxResource({
    params: () => {
      return {
        current: this.authService.currentContact()?.registrationTime,
        selected: this.selectedContactRegistrationTime()
      };
    },
    stream: ({ params }) => this.apiService.getMessagesWithSelectedContact(
      this.getConversationId(params.current ?? 0, params.selected)
    )
  });

  getContacts(): Observable<Contact[]> {
    // haal contacten op en filter de ingelogde gebruiker uit de lijst
    return this.apiService.getContacts()
    .pipe(
      map(contacts => contacts.filter(contact => contact.registrationTime !== this.authService.currentContact()?.registrationTime)),
    )
  }

  processMessage(chat: string) {
    // maak een Message object
    const message = {
      timeStamp: new Date().getTime(),
      sender: this.authService.currentContact()?.registrationTime,
      receiver: this.selectedContactRegistrationTime(),
      conversationId: this.getConversationId(this.authService.currentContact()?.registrationTime ?? 0, this.selectedContactRegistrationTime()),
      content: chat
    }
    this.apiService.addMessage(message as Message)
    this.conversation.update(prev => [...prev, message as Message])
  }

  getConversationId(senderID: number, receiverID: number) {
    return [senderID,receiverID].sort().join('_')
  }

  logout() {
    this.authService.logout()
    this.selectedContactRegistrationTime.set(0)
    this.conversation.set([])

    this.router.navigate(['/login'])
  }
}

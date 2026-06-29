import { inject, Injectable, signal } from '@angular/core';
import { Contact } from '@models/contact';
import { Message } from '@models/message';
import { ApiService } from '@services/ApiService/ApiService';
import { AuthService } from '@services/AuthService/AuthService';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiService = inject(ApiService)
  private authService = inject(AuthService)

  public conversation = signal<Message[]>([])
  public registeredContacts = signal<Contact[]>([]);
  public selectedContactRegistrationTime = signal(0)
  
  //** @description: selecteer een contact en zet de registrationTime in de signal 
  // deze registrationTime wordt gebruikt om de conversatie met het geselecteerde contact op te halen
  // */
  selectContact(registrationTime: number): void {
    this.selectedContactRegistrationTime.set(registrationTime);
    this.conversation.set(this.getConversationWithContact())
  }

  getContacts() {
    this.registeredContacts.set(this.apiService.getContacts())
  }

  processMessage(chat: string) {
    // maak een Message object
    const message = {
      timeStamp: new Date().getTime(),
      sender: this.authService.currentContact()?.registrationTime,
      receiver: this.selectedContactRegistrationTime(),
      content: chat
    }
    this.apiService.addMessage(message as any as Message)
    this.conversation.update(prev => [...prev, message as any as Message])
  }

  getConversationWithContact(): Message[]  {
    return this.apiService.getConversationWithContact(this.authService.currentContact()!.registrationTime, this.selectedContactRegistrationTime())
  }

}

import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { Contact } from '../contact/contact';
import { AuthService, ChatService } from '@services/index';
import { MessageInput } from '../message-input/message-input';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
import { ChatComponent } from '../chat/chat';
import { Header } from '../header/header';

@Component({
  selector: 'mainLayout',
  imports: [ChatComponent, Contact, Header, MessageInput ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  protected chatService = inject(ChatService)
  public authService = inject(AuthService)
  protected selectedContact = this.chatService.selectedContactRegistrationTime
  
  protected contacts = rxResource({
    stream: () => !!this.authService.currentContact()?.registrationTime
    ? this.chatService.getContacts()
    : EMPTY
    });
  
  selectContact(registrationTime: number) {
    this.chatService.selectContact(registrationTime)
    this.chatService.getMessagesWithContact()
  }

  sendMessage(chat: string) {
    this.chatService.processMessage(chat)
  }

}

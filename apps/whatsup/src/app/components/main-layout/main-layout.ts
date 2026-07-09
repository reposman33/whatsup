import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { ContactComponent } from '../contact/contact';
import { AuthService, ChatService } from '@services/index';
import { MessageInput } from '../message-input/message-input';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { ChatComponent } from '../chat/chat';
import { Header } from '../header/header';
import { Contact } from '@models/index';

@Component({
  selector: 'main-layout',
  imports: [ChatComponent, ContactComponent, Header, MessageInput ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  public authService = inject(AuthService)
  protected chatService = inject(ChatService)
  public authService = inject(AuthService)
  protected selectedContact = this.chatService.selectedContactRegistrationTime
  
  protected contacts = rxResource({
    stream: (): Observable<Contact[]> => 
      this.chatService.getContacts()
  });
  
  selectContact(registrationTime: number) {
    this.chatService.selectContact(registrationTime)
    this.chatService.getMessagesWithContact()
  }

  sendMessage(chat: string) {
    this.chatService.processMessage(chat)
  }

}

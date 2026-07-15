import { ChangeDetectionStrategy, Component, inject, ResourceRef, ViewEncapsulation } from '@angular/core';
import { ContactComponent } from '../contact/contact';
import { AuthService, ChatService } from '@services/index';
import { MessageInputComponent } from '../message-input/message-input';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { ChatComponent } from '../chat/chat';
import { HeaderComponent } from '../header/header';
import { Contact, Message } from '@models/index';


@Component({
  selector: 'main-layout',
  imports: [ChatComponent, ContactComponent, HeaderComponent, MessageInputComponent ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent  {
  public authService = inject(AuthService)
  protected chatService = inject(ChatService)
  protected selectedContact = this.chatService.selectedContactRegistrationTime
  protected messages!: ResourceRef<Message[] | undefined>
  
  protected contacts = rxResource({
    stream: (): Observable<Contact[]> => 
      this.chatService.getContacts()
  });
  
  selectContact(registrationTime: number) {
    this.chatService.selectedContactRegistrationTime.set(registrationTime)
  }

  sendMessage(chat: string) {
    this.chatService.processMessage(chat)
  }

}

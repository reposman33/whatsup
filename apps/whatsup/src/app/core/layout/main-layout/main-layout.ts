import { ChangeDetectionStrategy, Component, inject, ResourceRef, ViewEncapsulation } from '@angular/core';
import { ContactComponent } from '../../../features/contact/contact/contact';
import { AuthService } from '../../../features/auth/data-access/auth.service';
import { ChatService } from '../../../features/chat/data-access/chat.service';
import { MessageInputComponent } from '../../../features/chat/message-input/message-input';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { ChatComponent } from '../../../features/chat/chat/chat';
import { HeaderComponent } from '../header/header';
import { Contact, Message } from '../../../models';


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

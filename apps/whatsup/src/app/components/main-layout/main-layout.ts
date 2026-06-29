import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { Contact } from '../contact/contact';
import { ChatService } from '@services/index';
import { MessageInput } from '../message-input/message-input';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'mainLayout',
  imports: [ Contact, MessageInput ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  protected chatService = inject(ChatService)
  protected selectedContact = this.chatService.selectedContactRegistrationTime
  protected contacts = rxResource({
      stream: () => this.chatService.getContacts()
    });    

  selectContact(registrationTime: number) {
    this.chatService.selectContact(registrationTime)
  }

  sendMessage(chat: string) {
    this.chatService.processMessage(chat)
  }

}

import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { Contact } from '../contact/contact';
import { AuthService, ChatService } from '@services/index';
import { MessageInput } from '../message-input/message-input';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ChatComponent } from '../chat/chat';

@Component({
  selector: 'mainLayout',
  imports: [ChatComponent, Contact, MessageInput, DatePipe ],
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

    // readonly conversation = rxResource({
    //   // ensure stream returns an Observable; getMessagesWithContact may perform side-effects and return void
    //   stream: () => { this.chatService.getMessagesWithContact(); return EMPTY }
    // })

  ngOnInit(){
    this.chatService.getMessagesWithContact()
  }

  selectContact(registrationTime: number) {
    this.chatService.selectContact(registrationTime)
    this.chatService.getMessagesWithContact()
  }

  sendMessage(chat: string) {
    this.chatService.processMessage(chat)
  }

}

import { ChangeDetectionStrategy, Component, inject, ResourceRef, signal, ViewEncapsulation } from '@angular/core';
import { ContactComponent } from '../../../features/contact/contact/contact';
import { AuthService } from '../../../features/auth/data-access/auth.service';
import { ChatService } from '../../../features/chat/data-access/chat.service';
import { MessageInputComponent } from '../../../features/chat/message-input/message-input';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../header/header';
import { Contact, Message } from '../../../models';
import { Router, RouterModule } from "@angular/router";
import { GroupService } from '../../../features/group/group-service/group-service';


@Component({
  selector: 'main-layout',
  imports: [ContactComponent, HeaderComponent, MessageInputComponent, RouterModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent  {
  public authService = inject(AuthService)
  protected chatService = inject(ChatService)
  protected groupService = inject(GroupService)
  protected router = inject(Router)
  protected selectedContact = this.chatService.selectedContactRegistrationTime
  protected messages!: ResourceRef<Message[] | undefined>
  
  protected contacts = rxResource({
    stream: (): Observable<Contact[]> => 
      this.chatService.getContacts()
  });
  
  selectContact(registrationTime: number) {
    this.chatService.selectedContactRegistrationTime.set(registrationTime)
    this.router.navigateByUrl('conversation')
  }
  
  openModal() {
    this.groupService.addingNewGroup.set(true)
    this.router.navigate([{outlets: {modal: ['newgroup']}}])
  }

  closeModal(event: PointerEvent) {
    if(event.target === event.currentTarget) {
      this.router.navigate([{outlets: {modal: null}}])
    }
  }
}


import { ChangeDetectionStrategy, Component, inject, ResourceRef, ViewEncapsulation } from '@angular/core';
import { ContactComponent } from '../../../features/contact/contact';
import { AuthService } from '../../../features/auth/data-access/auth.service';
import { MessageInputComponent } from '../../../features/chat/message-input/message-input';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../header/header';
import { Group, Message } from '../../../models';
import { Router, RouterModule } from "@angular/router";
import { GroupService } from '../../../features/group/group-service/group-service';
import { StorageService } from '../../data-access/storage.service';
import { GroupComponent } from '../../../features/group/group/group';
import { ChatService } from '../../../features/chat/data-access/chat.service';


@Component({
  selector: 'main-layout',
  imports: [ContactComponent, GroupComponent, HeaderComponent, MessageInputComponent, RouterModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent  {
  public authService = inject(AuthService)
  protected groupService = inject(GroupService)
  protected chatService = inject(ChatService)
  protected storageService = inject(StorageService)
  protected router = inject(Router)
  protected messages!: ResourceRef<Message[] | undefined>
  
  protected groups = rxResource({
    stream: (): Observable<Group[]> => 
      this.storageService.getGroupsForContact(this.authService.currentContact()?.id || '')
  });

  protected pendingGroups = rxResource({
    stream: (): Observable<(Group & {invitationId: string})[]> => 
      this.storageService.getPendingGroups(this.authService.currentContact()?.id || '1')
  });
  
  openModal() {
    this.groupService.addingNewGroup.set(true)
    this.router.navigate([{outlets: {modal: ['newgroup']}}])
  }

  closeModal(event: PointerEvent | KeyboardEvent) {
    if(event.target === event.currentTarget) {
      this.router.navigate([{outlets: {modal: null}}])
    }
  }
}


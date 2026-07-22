import { ChangeDetectionStrategy, Component, inject, ResourceRef, ViewEncapsulation } from '@angular/core';
import { ContactComponent } from '../../../features/contact/contact/contact';
import { AuthService } from '../../../features/auth/data-access/auth.service';
import { MessageInputComponent } from '../../../features/chat/message-input/message-input';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { HeaderComponent } from '../header/header';
import { Contact, Group, Message } from '../../../models';
import { Router, RouterModule } from "@angular/router";
import { GroupService } from '../../../features/group/group-service/group-service';
import { StorageService } from '../../data-access/storage.service';


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
  protected groupService = inject(GroupService)
  protected storageService = inject(StorageService)
  protected router = inject(Router)
  protected messages!: ResourceRef<Message[] | undefined>
  
  protected contacts = rxResource({
    stream: (): Observable<Contact[]> => 
      this.storageService.getContacts()
      .pipe(
        map((contacts: Contact[]): Contact[] => contacts.filter(contact => contact.registrationTime !== this.authService.currentContact()?.registrationTime)),
      )
  });

  protected groups = rxResource({
    stream: (): Observable<Group[]> => 
      this.storageService.getGroups()
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


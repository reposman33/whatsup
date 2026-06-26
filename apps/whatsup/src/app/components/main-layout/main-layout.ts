import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { Contact } from '../contact/contact';
import { ApiService } from '@services/index';
import { RightClickEvent } from '@models/rightClickEvent';
import { AsyncPipe } from '@angular/common';
import { MessageInput } from '../message-input/message-input';

@Component({
  selector: 'mainLayout',
  imports: [ Contact, AsyncPipe, MessageInput ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  protected apiService = inject(ApiService)

  ngOnInit() {
    this.apiService.getContacts()
  }

  handleRightClick($event: RightClickEvent) {
    this.deleteContact($event.item.content)
  }

  // verwijder een contact. registrationTime is uniek genoeg als id
  deleteContact(registrationTime: number) {
    this.apiService.deleteContact(registrationTime)
    this.apiService.getContacts()
  }

}

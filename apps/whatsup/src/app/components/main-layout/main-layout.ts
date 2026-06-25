import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { Contact } from '../contact/contact';
import { ApiService } from '@services/index';
import { RightClickEvent } from '@models/rightClickEvent';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'mainLayout',
  imports: [ Contact, AsyncPipe ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  protected apiService = inject(ApiService)

  ngOnInit() {
    this.apiService.getUsers()
  }

  handleRightClick($event: RightClickEvent) {
    this.deleteUser($event.item.content)
  }

  // verwijder een user. registrationTime is uniek genoeg als id
  deleteUser(registrationTime: number) {
    this.apiService.deleteUser(registrationTime)
  }

}

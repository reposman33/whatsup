import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { Contact } from '../contact/contact';
import { ApiService } from '@services/index';
import { User } from '@models/user';

@Component({
  selector: 'mainLayout',
  imports: [],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {

}

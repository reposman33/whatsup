import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';
import { Message } from '../../../models/message.model';
import { AuthService } from '../../../features/auth/data-access/auth.service';
import { Temporal } from 'temporal-polyfill';

@Component({
  selector: 'chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  chat = input.required<Message>()
  protected authService = inject(AuthService)
  Temporal = Temporal;

}

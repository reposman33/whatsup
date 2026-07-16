import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';
import { Message } from '../../../models/message.model';
import { AuthService } from '../../../features/auth/data-access/auth.service';

@Component({
  selector: 'chat',
  imports: [DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  protected authService = inject(AuthService)
  chat = input.required<Message>()
}

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';
import { Message } from '@models/message';
import { AuthService } from '@services/index';

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
  index = input.required<number>()
}

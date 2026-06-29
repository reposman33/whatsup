import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { Message } from '@models/message';

@Component({
  selector: 'chat',
  imports: [DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  chat = input.required<Message>()
  index = input.required<number>()
}

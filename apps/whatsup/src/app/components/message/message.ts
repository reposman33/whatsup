import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { Message } from '@models/message';

@Component({
  selector: 'message',
  imports: [],
  templateUrl: './message.html',
  styleUrl: './message.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  message = input<Message>()
}

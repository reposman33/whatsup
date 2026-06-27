import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

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

import { ChangeDetectionStrategy, Component, inject, output, signal, ViewEncapsulation } from '@angular/core';
import { ChatService } from '../data-access/chat-store';

@Component({
  selector: 'message-input',
  imports: [ ],
  templateUrl: './message-input.html',
  styleUrl: './message-input.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInputComponent {
  sendMessage = output<string>()

  protected chatService = inject(ChatService)
  protected chat = signal('')

  send() {
    this.sendMessage.emit(this.chat())
    this.chat.set('')
  }

}

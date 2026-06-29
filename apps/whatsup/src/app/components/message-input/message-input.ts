import { ChangeDetectionStrategy, Component, inject, output, signal, ViewEncapsulation } from '@angular/core';
import { ChatService } from '@services/chat-service/chat-service';

@Component({
  selector: 'message-input',
  imports: [ ],
  templateUrl: './message-input.html',
  styleUrl: './message-input.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInput {
  onSendMessage = output<string>()

  protected chatService = inject(ChatService)
  protected chat = signal('')

  sendMessage() {
    this.onSendMessage.emit(this.chat())
    this.chat.set('')
  }

}

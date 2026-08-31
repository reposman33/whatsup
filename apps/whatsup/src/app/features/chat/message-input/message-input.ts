import { ChangeDetectionStrategy, Component, inject, output, signal, ViewEncapsulation } from '@angular/core';
import { ChatService } from '../../../shared/services/chat-service/chat.service';

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
  protected chat = signal<string>('')
  
  processMessage() {
    if(this.chat) {
      this.chatService.processMessage(this.chat())
    };
    this.chat.set('')
  }

}

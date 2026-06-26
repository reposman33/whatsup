import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { ChatService } from '@services/chat-service/chat-service';

@Component({
  selector: 'message-input',
  imports: [ AsyncPipe ],
  templateUrl: './message-input.html',
  styleUrl: './message-input.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInput {
  protected chatService = inject(ChatService)
  protected message = signal('')
  
  sendMessage() {
    this.chatService.processMessage(this.message())
    this.message.set('')
  }

}

import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
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

  sendMessage() {
    throw new Error('Method not implemented.');
  }

}

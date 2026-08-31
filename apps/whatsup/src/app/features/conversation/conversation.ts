import { afterRenderEffect, ChangeDetectionStrategy, Component, ElementRef, inject, viewChild, ViewEncapsulation } from '@angular/core';
import { ChatService } from '../../shared/services/chat-service/chat.service';
import { ChatComponent } from '../chat/chat/chat';

@Component({
  selector: 'app-conversation',
  imports: [ ChatComponent ],
  templateUrl: './conversation.html',
  styleUrl: './conversation.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col flex-1 min-h-0 w-full'
  }
})
export class ConversationComponent {
  private conversationContainer = viewChild<ElementRef<HTMLDivElement>>('conversationContainer')
  protected chatService = inject(ChatService)

  constructor() {
    afterRenderEffect({
      earlyRead: () => {
        this.chatService.messages.value(); // dit is de signal dependency die het effect triggert
        return this.conversationContainer()?.nativeElement.scrollHeight ?? 0;
      },
      write: (scrollHeight) => {
        const container = this.conversationContainer()
        if(!container) {
          return
        }
        container.nativeElement.scrollTo({top: scrollHeight(), behavior: 'smooth'})
      }
    })
  }
}

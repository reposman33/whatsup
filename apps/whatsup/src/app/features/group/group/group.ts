import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';
import { ChatService } from '../../chat/data-access/chat.service';

@Component({
  selector: 'group',
  imports: [],
  templateUrl: './group.html',
  styleUrl: './group.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupComponent {
  id = input<string>('');
  naam = input<string>('');
  description = input<string>('')
  status = input<string>('accepted')
  invitationId = input<string>('')

  protected chatService = inject(ChatService)
  
  handleSelectGroup(groupId: string) {
    // toon de contacten in de group
    this.chatService.selectedGroupId.set(groupId)
  }
}

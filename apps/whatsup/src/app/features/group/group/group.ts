import { ChangeDetectionStrategy, Component, inject, input, model, ViewEncapsulation } from '@angular/core';
import { ChatService } from '../../chat/data-access/chat.service';
import { StorageService } from '../../../core/data-access/storage.service';
import { AuthService } from '../../auth/data-access/auth.service';

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
  selectedGroupId = model<string>('')

  protected chatService = inject(ChatService)
  protected storageService = inject(StorageService)
  protected authService = inject(AuthService)
  
  acceptInvitation(invitationId: string) {
    this.updateGroupInvitation(invitationId, 'accept')
  }
  
  declineInvitation(invitationId: string) {
    this.updateGroupInvitation(invitationId, 'decline')
  }
  
  deleteGroup(id: string) {
    // TODO delete group
    this.storageService.deleteGroup(id, this.authService.currentContact()!.id);
  }
  
  onSelectGroup(groupId: string) {
    this.selectedGroupId.set(groupId)
  }

  updateGroupInvitation(invitationId: string, status: 'accept' | 'decline') {
    this.storageService.updateGroupInvitation(invitationId, this.id(), status, this.authService.currentContact()!.id)
  }

}

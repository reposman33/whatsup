import { ChangeDetectionStrategy, Component, inject, input, model, ViewEncapsulation } from '@angular/core';
import { StorageService } from '../../../core/data-access/storage.service';
import { AuthService } from '../../auth/data-access/auth.service';
import { Router } from '@angular/router';

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

  protected authService = inject(AuthService)
  protected router = inject(Router)
  protected storageService = inject(StorageService)
  
  acceptInvitation($event: {$event: MouseEvent | KeyboardEvent, invitationId: string}) {
    $event.$event.stopPropagation();
    this.updateGroupInvitation($event.invitationId, 'accept')
  }
  
  declineInvitation($event: {$event: MouseEvent | KeyboardEvent, invitationId: string}) {
    $event.$event.stopPropagation();
    this.updateGroupInvitation($event.invitationId, 'decline')
  }
  
  deleteGroupMembership($event: {$event: MouseEvent, groupId: string}) {
    $event.$event.stopPropagation();
    this.storageService.deleteGroupMembership($event.groupId, this.authService.currentContact()!.id, "Wil je echt je deelname aan deze groep beeindigen? Je zult dan geen berichten meer ontvangen van deze groep en je deelname wordt verwijderd.");
  }

  onEditGroup($event: {$event: MouseEvent, groupId: string}) {
    $event.$event.stopPropagation();
    this.router.navigate([{ outlets: { modal: ['editgroup', $event.groupId] } }])
  }

  onSelectGroup(groupId: string) {
    this.selectedGroupId.set(groupId)
  }

  updateGroupInvitation(invitationId: string, status: 'accept' | 'decline') {
    this.storageService.updateGroupInvitation(invitationId, this.id(), status, this.authService.currentContact()!.id)
  }

}

import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { StorageService } from '../../../core';
import { GroupService } from '../group-service/group-service';
import { AuthService } from '../../auth/data-access/auth.service';
import { Contact, Group } from '../../../models';
import { Temporal } from 'temporal-polyfill';
import { SelectList } from './select-list/select-list';
@Component({
  selector: 'app-create-new-group',
  imports: [ SelectList ],
  templateUrl: './create-new-group.html',
  styleUrl: './create-new-group.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-3/6 bg-dialog-bg rounded-xl shadow-card'
  }
})
export class CreateNewGroupComponent {
  protected groupName = signal<string>('');
  protected groupDescription = signal<string>('');
  protected errorText = signal<string>('')

  private groupService = inject(GroupService)
  private storageService = inject(StorageService)
  private authService = inject(AuthService)

  protected selectedContacts = signal<Contact[]>([])

  async createNewGroup(){
    const now = Temporal.Now.zonedDateTimeISO().toString()
    // 1: voeg group toe
    const group = {
      createdAt: now,
      description: this.groupDescription(),
      name: this.groupName(),
    } as Group
    const addGroupResult = await this.storageService.addGroup(group)

    // 2: voeg mezelf toe aan memberships collectie als member van deze groep
    const updateMembershipResult = await this.storageService.addMembership({
      groupId: addGroupResult.id,
      contactId: this.authService.currentContact()?.id ?? '',
      email: this.authService.currentContact()?.email ?? '',
      invitedAt: now,
      acceptedAt: now,
    })

    // 3: voeg voor elke uitgenodigde contact een document toe aan de groupInvitations collectie
    // contacts is een signal met alle toegevoegde contacten, 
    this.storageService.addGroupInvitations(this.selectedContacts() || [], this.authService.currentContact()?.id?? '', addGroupResult.id)
    this.closeDialog()
  }

  closeDialog(){
    this.groupService.closeNewGroupDialog()
  }

}
  
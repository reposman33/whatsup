import { ChangeDetectionStrategy, Component, effect, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { StorageService } from '../../../core';
import { GroupService } from '../group-service/group-service';
import { Contact, Group } from '../../../models';
import { Temporal } from 'temporal-polyfill';
import { SelectList } from './select-list/select-list';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, Observable, switchMap } from 'rxjs';
import { AuthService } from '../../auth/data-access/auth.service';
@Component({
  selector: 'app-create-new-group',
  imports: [ SelectList ],
  templateUrl: './create-edit-group.html',
  styleUrl: './create-edit-group.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-3/6 bg-dialog-bg rounded-xl shadow-card'
  }
})
export class CreateEditGroupComponent {
  protected groupName = signal<string>('');
  protected groupDescription = signal<string>('');
  protected selectedContacts = signal<Contact[]>([])

  protected groupId = input<string>('') // gevuld bij editen van groep
  
  get isEditMode(): boolean {
    return !!this.groupId();
  }

  private authService = inject(AuthService)
  private groupService = inject(GroupService)
  private storageService = inject(StorageService)
  
  private currentUserId = this.authService.currentContact().id

  group = rxResource({
    params: () => {
      const id = this.groupId();
      return id ? {groupId: id} : undefined
    },
    stream: ({params}): Observable<{group: Group, contacts: Contact[]}> => {
      return this.storageService.getGroup(params.groupId).pipe(
        switchMap((group: Group): Observable<{group: Group, contacts: Contact[]}> => {
          return this.storageService.getContactsByGroup(params.groupId).pipe(
            map((contacts: Contact[]): Contact[] => contacts.filter((contact: Contact) => contact.id !== this.currentUserId)),
            map((contacts: Contact[]): {group: Group, contacts: Contact[]} => {
              return ({group, contacts});
            })
          );
        })
      )
    }
  })

  constructor(){
    effect(() => {
      const currentGroup = this.group.value()
      if(currentGroup) {
        this.groupName.set(currentGroup.group.name)
        this.groupDescription.set(currentGroup.group.description)
        this.selectedContacts.set(currentGroup.contacts)
      }
    })
  }

  async saveGroup() {
    if(this.isEditMode) {
      this.storageService.updateGroup(this.groupId(), {
        name: this.groupName(),
        description: this.groupDescription()
      });
      // alleen nieuwe contacten toevoeggen als ze nog niet in de collectie zitten
      const newContacts = this.selectedContacts().filter((contact: Contact) => !this.group.value()?.contacts.some((c: Contact) => c.id === contact.id));
      this.storageService.addGroupInvitations(newContacts || [], this.authService.currentContact()?.id ?? '', this.groupId())
    } else {
     const addedGroup = await this.storageService.addGroup({
        createdAt: Temporal.Now.zonedDateTimeISO().toString(),
        name: this.groupName(),
        description: this.groupDescription()
      });

      // voeg de aanmaker van de groep toe als member
      const now = Temporal.Now.zonedDateTimeISO().toString()
      const userId = this.authService.currentContact().id
      const userEmail = this.authService.currentContact().email
      this.storageService.addMembership({
        acceptedAt: now,
        contactId: userId,
        email: userEmail,
        groupId: addedGroup.id,
        invitedAt: now
      })

      this.storageService.addGroupInvitations(this.selectedContacts() || [], this.authService.currentContact()?.id ?? '', addedGroup.id)
    }

    this.closeDialog()
  }

  closeDialog(){
    this.groupService.closeNewGroupDialog()
  }

}
  
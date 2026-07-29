import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { StorageService } from '../../../core';
import { GroupService } from '../group-service/group-service';
import { AuthService } from '../../auth/data-access/auth.service';
import { Group } from '../../../models';
@Component({
  selector: 'app-create-new-group',
  imports: [],
  templateUrl: './create-new-group.html',
  styleUrl: './create-new-group.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-3/6 bg-dialog-bg rounded-xl shadow-card'
  }
})
export class CreateNewGroupComponent {
  protected emailAddress = signal<string>('');
  protected emailAddresses = signal<string[]>([]);
  protected groupName = signal<string>('');
  protected groupDescription = signal<string>('');
  protected emailAddressesText = computed<string>((): string => this.emailAddresses().join('\n'));
  protected errorText = signal<string>('')

  private groupService = inject(GroupService)
  private storageService = inject(StorageService)
  private authService = inject(AuthService)
 
  private invalidEmailError = 'Vul een geldig e-mail adres in!'

  addEmailAddress() {
    if(!this.isValidEmail(this.emailAddress())) {
      this.errorText.set(this.invalidEmailError)
      return
    }
    this.emailAddresses.update((value: string[]): string[] => {
      value.push(this.emailAddress())
      this.emailAddress.set('')
      return value
    })
  }

  deleteEmailAddress(index: number): void {
    this.emailAddresses.update(value => {
      return value.filter((_,i) => i !== index)
    })
  }
  
  async createNewGroup(){
    const group = {
      createdAt: new Date().getTime(),
      description: this.groupDescription(),
      name: this.groupName(),
    } as Group
    const addGroupResult = await this.storageService.addGroup(group)

    console.log('addGroupResult.id: ', addGroupResult.id);

    //  voeg groepsinvitations toe
    // const now = Temporal.Now.zonedDateTimeISO().toString()
    //   this.storageService.updateMembership({
    //       groupId: res.group?.id ?? '',
    //       contactId: this.authService.currentContact()?.id ?? '',
    //       email: this.authService.currentContact()?.email ?? '',
    //       invitedAt: now,
    //       acceptedAt: now,
    //     })
    //     console.log(`membership van group ${res.group?.id ?? ''} toegevoegd`);
    //     this.closeDialog()
    //   },
    //   error: (err) => {
    //     console.log('err: ', err);
    //     throw new Error(err);
    //   }
    // })
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  closeDialog(){
    this.groupService.closeNewGroupDialog()
  }

}
  
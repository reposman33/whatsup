import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { StorageService } from '../../../core';
@Component({
  selector: 'app-create-new-group',
  imports: [],
  templateUrl: './create-new-group.html',
  styleUrl: './create-new-group.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewGroupComponent {
  protected emailAddress = signal<string>('');
  protected emailAddresses = signal<string[]>([]);
  protected groupName = signal<string>('');
  protected groupDescription = signal<string>('');
  protected emailAddressesText = computed<string>((): string => this.emailAddresses().join('\n'));
  protected errorText = signal<string>('')
  
  private location = inject(Location)
  private storageService = inject(StorageService)
 
  private invalieEmailError = 'Vul een geldig e-mail adres in!'

  addEmailAddress() {
    if(!this.isValidEmail(this.emailAddress())) {
      this.errorText.set(this.invalieEmailError)
      return
    }
    this.emailAddresses.update((value: string[]): string[] => {
      value.push(this.emailAddress())
      this.emailAddress.set('')
      return value
    })
  }

  deleteEmailAddress(emailAddress: string): void {
    this.emailAddresses.update(value => {
      return value.filter(_emailAddress => _emailAddress !== emailAddress)
    })
  }
  
  addGroup() {
    const group = {
      name: this.groupName(),
      description: this.groupDescription(),
      emailAddresses: this.emailAddresses(),
      createdAt: new Date().getTime()
    }
    const g = this.storageService.addGroup(group)
    console.log('Groep toegevoegd: : ', g);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  goBackOnePage(){
    this.location.back()
  }
}

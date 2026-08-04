import { ChangeDetectionStrategy, Component, inject, model, ViewEncapsulation } from '@angular/core';
import { Contact } from '../../../../models';
import { StorageService } from '../../../../core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../../../auth/data-access/auth.service';

@Component({
  selector: 'select-list',
  imports: [],
  templateUrl: './select-list.html',
  styleUrl: './select-list.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectList {
  selectedContacts = model<Contact[]>([])
  authService = inject(AuthService)
  private currentUserId = this.authService.currentContact()!.id

  protected storageService = inject(StorageService)
  protected availableContacts = rxResource({
    params: () => this.selectedContacts().map((contact: Contact) => contact.id),
    stream: (): Observable<Contact[]> => this.storageService.getContacts().pipe(
      switchMap((Contacts: Contact[]): Observable<Contact[]> => of(
        Contacts
        .filter((contact: Contact) => contact.id !== this.currentUserId)
        .filter((contact: Contact) => !this.selectedContacts().some((selectedContact: Contact) => selectedContact.id === contact.id))
        .sort(this.sortContactsByNameAsc)))
    )
  })

  toggleContact(contact: Contact) {
    if(this.availableContacts.value()?.includes(contact)) {
      // contact verwijderen uit beschikbare availableContacts
      this.availableContacts.update((availableContacts): Contact[] => availableContacts?.filter(c => c !== contact) ?? [])
      // contact toevoegen aan selectedContacts
      this.selectedContacts.update((selectedContacts): Contact[] => [...selectedContacts, contact]);
    } else if(this.selectedContacts()?.includes(contact)) {
      // contact toevoegen aan beschikbare contacten
      this.availableContacts.update((availableContacts): Contact[] => [...(availableContacts ?? []), contact].sort(this.sortContactsByNameAsc));
      // contact verwijderen uit selectedContacts
      this.selectedContacts.update((selectedContacts): Contact[] => selectedContacts?.filter(c => c !== contact) ?? [])
    }
  }

  private sortContactsByNameAsc(a: Contact, b: Contact): 1 | -1 | 0 {
    return (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0
  }
}

import { inject, Injectable } from '@angular/core';
import { AuthenticateService } from '../../../../features/auth/data-access/auth-provider';
import { StorageService } from '../../../../core/data-access/storage.service';
import { Contact, RegistrationOptions } from '../../../../models';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';

interface RegisteredContact extends RegistrationOptions {
  id: string;
}
@Injectable({
  providedIn: 'root',
})
export class LocalAuthService  extends AuthenticateService{
  private storageService = inject(StorageService)

  login(email: string, password: string): Observable<Contact | undefined> {
    return from(Promise.resolve(this.storageService.getContact(email + '_' + password)));
  }
  
  logout(): Observable<void> {
    return of(undefined);
  }

  register(contact: RegistrationOptions) {
    const registeredContacts = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    // maak een id voor contact
    const registeredContact: RegisteredContact = {
      ...contact,
      id: contact.email + '_' + contact.password
    } 
    registeredContacts.push(registeredContact);
  
    localStorage.setItem('registeredUsers', JSON.stringify(registeredContacts));
  }

}

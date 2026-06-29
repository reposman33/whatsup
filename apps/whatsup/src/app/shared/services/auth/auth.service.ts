import { inject, Injectable, signal } from '@angular/core';
import { Contact } from '@models/contact';
import { AuthenticateService } from './authenticate.service.';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authenticateService = inject(AuthenticateService);
  public currentContact = signal<Contact | undefined>(undefined);

  login(email: string, password: string): void {
    this.currentContact.set(this.authenticateService.login(email,password))
  }

  logout() {
    this.currentContact.set(this.authenticateService.logout());
   }
  
  register(contact: Contact) {
    this.authenticateService.register(contact);
  }

}

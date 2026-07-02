import { inject, Injectable, signal } from '@angular/core';
import { Contact } from '@models/contact';
import { AuthenticateService } from '@services/auth/authenticate.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authenticateService = inject(AuthenticateService);
  public currentContact = signal<Contact | undefined>(undefined);

  async login(email: string, password: string): Promise<void> {
    const contact = await this.authenticateService.login(email, password).toPromise();
    this.currentContact.set(contact);
  }

  async logout(): Promise<void> {
    await this.authenticateService.logout().toPromise();
    this.currentContact.set(undefined);
  }

  register(contact: Contact & Pick<{password: string}, 'password'>): void {
    this.authenticateService.register(contact);
  }

}

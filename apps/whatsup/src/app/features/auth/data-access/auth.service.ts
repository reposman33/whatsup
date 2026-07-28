import { inject, Injectable, signal } from '@angular/core';
import { Contact, RegistrationOptions } from '../../../models';
import { AuthenticateService } from './auth-provider';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authenticateService = inject(AuthenticateService);
  public currentContact = signal<Contact | undefined>({} as Contact);

  async login(email: string, password: string): Promise<void> {
    const contact = await firstValueFrom(this.authenticateService.login(email, password));
    this.currentContact.set(contact);
  }

  async logout(): Promise<void> {
    await this.authenticateService.logout().toPromise();
    this.currentContact.set(undefined);
  }

  async register(contact: RegistrationOptions): Promise<void> {
    await this.authenticateService.register(contact);
  }

}

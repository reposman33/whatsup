import { inject, Injectable, signal } from '@angular/core';
import { AuthenticateService } from '../authenticate.service';
import { ApiService } from '@services/api/api.service';
import { Contact } from '@models/contact';

@Injectable({
  providedIn: 'root',
})
export class LocalAuthService  extends AuthenticateService{
  private apiService = inject(ApiService)
  public currentContact = signal<Contact | undefined>(undefined);

  login(email: string, password: string): Contact | undefined {
    const contact = this.apiService.getContact(email, password);
    this.currentContact.set(contact);
    return contact;
  }
  
  logout(): undefined {
    return undefined;
  }

  register(contact: Contact): void {
    this.apiService.registerContact(contact);
  }

}

import { inject, Injectable, signal } from '@angular/core';
import { AuthenticateService } from '../authenticate.service.';
import { ApiService } from '@services/api/api.service';
import { Contact } from '@models/contact';

@Injectable({
  providedIn: 'root',
})
export class LocalAuthService  extends AuthenticateService{
  private apiService = inject(ApiService)

  login(email: string, password: string): Contact | undefined {
    return this.apiService.getContact(email,password)
  }
  
  logout(): undefined {
    return undefined;
  }

  register(contact: Contact): void {
    this.apiService.registerContact(contact);
  }

}

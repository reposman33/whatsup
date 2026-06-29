import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@services/api.service/api.service';
import { Contact } from '@models/contact';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  apiService = inject(ApiService);
  public currentContact = signal<Contact | undefined>(undefined);

  private _requestedUrl:string | undefined = undefined;

  register(contact: Contact) {
    this.apiService.registerContact(contact);
  }

  /**
   * @description - vraag aan de ApiServer een contact op met de gegeven credentials.
   * Geeft een Contact object of undefined als contact niet gevonden
   * @param email - contact e-mail
   * @param password  - uer password
   */
  authenticate(email: string, password: string): void {
    this.currentContact.set(this.apiService.getContact(email,password))
  }

  logout() {
    this.currentContact.set(undefined);
   }
}

import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '@services/ApiService/ApiService';
import { Contact } from '@models/contact';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  // firebase
  // ...
  private authenticatedSubject = new BehaviorSubject<Contact | undefined>(undefined);
  private _currentContactRegistrationTime: number | undefined;
  currentContact$ = this.authenticatedSubject.asObservable();
  apiService = inject(ApiService);

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
    const authenticatedContact = this.apiService.getContact(email,password)
    this._currentContactRegistrationTime = authenticatedContact?.registrationTime
    this.authenticatedSubject.next(authenticatedContact);
  }

  set requestedUrl(url: string | undefined) {
    this._requestedUrl = url;
  }

  get requestedUrl(): string | undefined {
    return this._requestedUrl;
  }

  get currentContactRegistrationTime() {
    return this._currentContactRegistrationTime
  }

  logout() {
    this.authenticatedSubject.next(undefined);
   }
}

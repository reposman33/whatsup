import { inject, Injectable } from '@angular/core';
import { AuthenticateService } from '../authenticate.service';
import { ApiService } from '@services/api/api.service';
import { Contact } from '@models/contact';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class LocalAuthService  extends AuthenticateService{
  private apiService = inject(ApiService)

  login(email: string, password: string): Observable<Contact | undefined> {
    return of(this.apiService.getContact(email, password));
  }
  
  logout(): Observable<void> {
    return of(undefined);
  }

  register(contact: Contact): void {
    this.apiService.registerContact(contact);
  }

}

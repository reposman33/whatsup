import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '@services/ApiService/ApiService';
import { User } from '@models/user';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  // firebase
  // ...
  private authenticatedSubject = new BehaviorSubject<User | undefined>(undefined);
  currentUser$ = this.authenticatedSubject.asObservable();
  apiService = inject(ApiService);

  private _requestedUrl:string | undefined = undefined;

  register(user: User) {
    this.apiService.registerUser(user);
  }

  /**
   * @description - vraag aan de ApiServer een user op met de gegeven credentials.
   * Geeft een User object of undefined als user niet gevonden
   * @param email - user e-mail
   * @param password  - uer password
   */
  authenticate(email: string, password: string): void {
    this.authenticatedSubject.next(this.apiService.getUser(email,password));
  }

  set requestedUrl(url: string | undefined) {
    this._requestedUrl = url;
  }

  get requestedUrl(): string | undefined {
    return this._requestedUrl;
  }

   logout() {
    this.authenticatedSubject.next(undefined);
   }
}

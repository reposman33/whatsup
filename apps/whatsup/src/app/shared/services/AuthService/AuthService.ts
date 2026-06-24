import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '..';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  // firebase
  // ...
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSubject.asObservable();
  apiService = inject(ApiService);

  private authenticated = false
  private _requestedUrl:string | undefined = undefined;

  register(email: string, password: string) {
    this.apiService.registerUser(email, password);
  }

  authenticate(email: string, password: string) {
    const user = this.apiService.getUser(email,password)
    this.authenticated = !!user;
    this.authenticatedSubject.next(!!user);
  }

   isAuthenticated() {
    return this.authenticated
  }

  set requestedUrl(url: string | undefined) {
    this._requestedUrl = url;
  }

  get requestedUrl(): string | undefined {
    return this._requestedUrl;
  }

   logout() {
    this.authenticated = false;
    this.authenticatedSubject.next(false);
   }
}

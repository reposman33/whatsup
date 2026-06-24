import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type loginMethod = 'localstorage' | 'firebase';
@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private loginMethod: loginMethod = 'localstorage';
  // firebase
  // ...
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSubject.asObservable();

  private authenticated = false
  private _requestedUrl:string | undefined = undefined;

  register(email: string, password: string) {
    switch (this.loginMethod) {
      case 'localstorage':
      this.registerUserToLocalStorage(email, password);
    }
  }

  authenticate(email: string, password: string) {
    // Implementation for authentication
    switch (this.loginMethod) {
      case 'localstorage':
        this.authenticateUserWithLocalStorage(email, password);
      }
  }

  registerUserToLocalStorage(email: string, password: string) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredUsers.push({ email, password });
    
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }

  authenticateUserWithLocalStorage(email: string, password: string) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find((user: { email: string; password: string }) => user.email === email && user.password === password);
    this.authenticated = !!user;
    this.authenticatedSubject.next(!!user);
    return !!user;
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

import { Injectable } from '@angular/core';

type loginMethod = 'localstorage' | 'firebase';
@Injectable({
  providedIn: 'root',
})

export class AuthenticateService {
  private loginMethod: loginMethod = 'localstorage';
  // firebase
  // ...

  private authenticated = false
  private _requestedUrl:string | undefined = undefined;

  register(email: string, password: string) {
    switch (this.loginMethod) {
    case 'localstorage':
      this.addUserToLocalStorage(email, password);
    }
  }

  addUserToLocalStorage(email: string, password: string) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredUsers.push({ email, password });
    
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }

  authenticate(email: string, password: string) {
    // Implementation for authentication
    switch (this.loginMethod) {
      case 'localstorage':
        this.authenticateWithLocalStorage(email, password);
      }
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

  authenticateWithLocalStorage(email: string, password: string) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find((user: { email: string; password: string }) => user.email === email && user.password === password);
    
    this.authenticated = user !== undefined;
   }

}

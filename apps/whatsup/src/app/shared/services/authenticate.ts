import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  private authenticated = false
  private _requestedUrl:string | undefined = undefined;

  authenticate(email: string, password: string) {
    this.authenticated = email === 'test@test.com' && password === 'test';
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

}

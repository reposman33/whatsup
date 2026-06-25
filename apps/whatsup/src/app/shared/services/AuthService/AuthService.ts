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
  private authenticatedSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.authenticatedSubject.asObservable();
  apiService = inject(ApiService);

  private _requestedUrl:string | undefined = undefined;

  register(user: User) {
    this.apiService.registerUser(user);
  }

  authenticate(email: string, password: string) {
    const user = this.apiService.getUser(email,password)
    this.authenticatedSubject.next(user as User);
  }

  set requestedUrl(url: string | undefined) {
    this._requestedUrl = url;
  }

  get requestedUrl(): string | undefined {
    return this._requestedUrl;
  }

   logout() {
    this.authenticatedSubject.next(null);
   }
}

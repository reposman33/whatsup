import { Injectable } from '@angular/core';
import { Contact } from '@models/contact';

@Injectable({
  providedIn: 'root',
})
export class FireBaseAuthService {
  
  login(email: string, password: string): Contact | undefined {
    return undefined
  }
  
  logout(): undefined {
    return undefined
  }
  
  register(contact: Contact): void {}
  
}

import { Injectable } from '@angular/core';

type loginMethod = 'localstorage' | 'firebase';
type User = { email: string; password: string }
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private storage: loginMethod = 'localstorage';
  
  registerUser(email: string, password: string) {
    switch (this.storage) {
      case 'localstorage': {
        this.addUserToLocalStorage(email, password);
      }
    }
  }

  getUser(email: string, password: string): User | undefined {
    switch (this.storage) {
      case 'localstorage': {
        return this.getUserFromLocalStorage(email, password);
      }
    }
    return undefined
  }

  addUserToLocalStorage(email: string, password: string) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredUsers.push({ email, password });
  
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }


  getUserFromLocalStorage(email: string, password: string): User | undefined {
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    .find((user: User) => user.email === email && user.password === password);
  }
  
}

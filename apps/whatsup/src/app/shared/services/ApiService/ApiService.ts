import { Injectable } from '@angular/core';
import { User } from '../../../models';
import { Message } from '../../../models';

type loginMethod = 'localstorage' | 'firebase';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private storage: loginMethod = 'localstorage';
  
  registerUser(email: string, password: string, gebruikersNaam: string) {
    switch (this.storage) {
      case 'localstorage': {
        this.addUserToLocalStorage(email, password, gebruikersNaam);
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

  getUsers(): User[] | [] {
    switch (this.storage) {
      case 'localstorage': {
        return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      }
    }
    return [];
  }

  addMessage(message: Message) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push({ message });
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  getMessages() {
    return JSON.parse(localStorage.getItem('messages') || '[]');
  }

  addUserToLocalStorage(email: string, password: string, gebruikersNaam: string) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredUsers.push({ email, password, gebruikersNaam });
  
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }


  getUserFromLocalStorage(email: string, password: string): User | undefined {
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    .find((user: User) => user.email === email && user.password === password);
  }
  
}

import { Injectable } from '@angular/core';
import { User } from '@models/user';
import { Message } from '@models/message';
import { BehaviorSubject } from 'rxjs';

type loginMethod = 'localstorage' | 'firebase';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private storage: loginMethod = 'localstorage';
  private registeredUsersBehaviorSubject = new BehaviorSubject<User[]>([])

  registeredUsers$ = this.registeredUsersBehaviorSubject.asObservable()

  registerUser(user: User) {
    switch (this.storage) {
      case 'localstorage': {
        this.addUserToLocalStorage(user);
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
        this.registeredUsersBehaviorSubject.next(JSON.parse(localStorage.getItem('registeredUsers') || '[]'))
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

  addUserToLocalStorage(user: User) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    registeredUsers.push(user);
  
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }

  getUserFromLocalStorage(email: string, password: string): User | undefined {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    .find((user: User) => user.email === email && user.password === password);
  }

  deleteUser(registrationTime: number) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    localStorage.setItem('registeredUsers',JSON.stringify(registeredUsers.filter((user: User) => user.registrationTime !== registrationTime)))
    // opnieuw users opvragen om lijst te tonen
    this.getUsers()

    return false
  }
    
}

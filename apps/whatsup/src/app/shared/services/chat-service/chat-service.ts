import { inject, Injectable } from '@angular/core';
import { Message } from '@models/message';
import { ApiService } from '@services/ApiService/ApiService';
import { AuthService } from '@services/AuthService/AuthService';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private currentContactSubject = new BehaviorSubject<{registrationTime: number} | undefined>(undefined);
  private _currentContactRegistrationTime = 0
  private authService = inject(AuthService)
  private apiService = inject(ApiService)
  public currentContactRegistrationTime$ = this.currentContactSubject.asObservable();

  // er is op een contact geklikt - zend de id uit voor tekstInput component bijv 
  selectContact(registrationTime: number): void {
    this._currentContactRegistrationTime = registrationTime;
    this.currentContactSubject.next({registrationTime: registrationTime})
  }

  processMessage(chat: string) {
    // maak een Message object
    const message = {
      timeStamp: new Date().getTime(),
      sender: this.authService.currentContactRegistrationTime,
      receiver: this._currentContactRegistrationTime,
      content: chat
    }
    // casten van generiek Object naar message anders zegt TS Argument of type
    // '{ timeStamp: number; sender: number; receiver: number; content: string; }' is not assignable to parameter of type 'Message'.
    this.apiService.addMessage(message as any as Message)
  }

}

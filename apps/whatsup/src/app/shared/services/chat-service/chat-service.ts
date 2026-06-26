import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private currentContactSubject = new BehaviorSubject<number>(0);
  currentContact$ = this.currentContactSubject.asObservable();

  // er is op een contact geklikt - zend de id uit voor tekstInput component bijv 
  selectContact(registrationTime: number): void {
    this.currentContactSubject.next(registrationTime)
  }

}

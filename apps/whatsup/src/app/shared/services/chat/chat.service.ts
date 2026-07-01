import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '@models/contact';
import { Message } from '@models/message';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiService = inject(ApiService)
  private authService = inject(AuthService)
  private router = inject(Router)

  public conversation = signal<Message[]>([])
  public contacts = signal<Contact[]>([]);
  public selectedContactRegistrationTime = signal(0)
  
  //** @description: selecteer een contact en zet de registrationTime in de signal 
  // deze registrationTime wordt gebruikt om de conversatie met het geselecteerde contact op te halen
  // */
  selectContact(registrationTime: number): void {
    this.selectedContactRegistrationTime.set(registrationTime);
  }

  getContacts(): Observable<Contact[]> {
    // haal contacten op en filter de ingelogde gebruiker uit de lijst
    return this.apiService.getContacts().pipe(
      map(contacts => contacts.filter(contact => contact.registrationTime !== this.authService.currentContact()?.registrationTime)),
      tap(contacts => this.contacts.set(contacts))
    )
  }

  processMessage(chat: string) {
    // maak een Message object
    const message = {
      timeStamp: new Date().getTime(),
      sender: this.authService.currentContact()?.registrationTime,
      receiver: this.selectedContactRegistrationTime(),
      content: chat
    }
    this.apiService.addMessage(message as any as Message)
    this.conversation.update(prev => [...prev, message as any as Message])
  }

  getMessagesWithContact(): void  {
    this.apiService.getMessagesWithContact(this.authService.currentContact()!.registrationTime, this.selectedContactRegistrationTime())
    .subscribe(messages => this.conversation.set(messages))
  }

  logout() {
    this.authService.logout()
    this.selectedContactRegistrationTime.set(0)
    this.conversation.set([])

    this.router.navigate(['/login'])
  }
}

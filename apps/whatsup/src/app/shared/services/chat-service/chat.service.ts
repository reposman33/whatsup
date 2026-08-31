import { computed, inject, Injectable, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Message } from '../../../models/message.model';
import { StorageService } from '../../../core/data-access/storage.service';
import { AuthService } from '../../../features/auth/data-access/auth.service';
import { Contact } from '../../../models';
import { map, Observable, of } from 'rxjs';
import { UtilsService } from '../utils-service/utilsService';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private storageService = inject(StorageService)
  private authService = inject(AuthService)
  private utilsService = inject(UtilsService)
  private router = inject(Router)
  private http = inject(HttpClient)

  public conversation = signal<Message[]>([])
  public selectedGroupId = signal<string | undefined>(undefined)

  public messages: ResourceRef<Message[] | undefined> = rxResource({
    params: () => ({
        selectedGroupId: this.selectedGroupId()
      }),
    stream: ({ params }):Observable<Message[]> => params.selectedGroupId
    ? this.storageService.getMessagesByGroup(params.selectedGroupId)
    : of([]) as Observable<Message[]>
  });
  
  public sortedMessages = computed(() => {
    if (!this.messages.hasValue()) {
      return []
    } else {
      return[...this.messages.value()]
      .sort((a: Message, b: Message) => a.timeStamp.localeCompare(b.timeStamp, 'nl-NL'))
}  })

  public contacts: ResourceRef<Contact[] | undefined> = rxResource({
    params: () => (
      {selectedGroupId: this.selectedGroupId()}
    ),
    stream: ({ params }): Observable<Contact[]> => params.selectedGroupId
    ? this.storageService.getContactsByGroup(params.selectedGroupId).pipe(
      // niet mezelf tonen als lid van deze groep...
      map(contacts => contacts.filter(contact => contact.id !== this.authService.currentContact()?.id))
    )
    : of([]) as Observable<Contact[]>
  });

  async processMessage(chat: string) {
    // bepaal of er vertaald moet worden
    const targetLang = chat.match(/tl:(\w{2})/)
    let translated = chat
    if(targetLang) {
      // voer vertaling uit
      translated = await this.utilsService.translateText(chat.replace(/tl:\w{2}/, ""), targetLang[1])
    }
    // maak een Message object
    const message = {
      content: translated,
      groupId: this.selectedGroupId(),
      sender: this.authService.currentContact()?.id || '',
      timeStamp: new Date().toISOString(),
    }
    // opslaan in Firestore db via service
    this.storageService.addMessage(message as unknown as Message)
    this.conversation.update(prev => [...prev, message as unknown as Message])

    // // opslaan via n8n automated workflow
    // this.http.post(AppConfig.n8n_webhook_url, message).subscribe(() => {
    //   // this.storageService.addMessage(message as unknown as Message)
    //   this.conversation.update(prev => [...prev, message as unknown as Message])
    // })
  }

  getConversationId(senderID: string, receiverID: string) {
    return [senderID,receiverID].sort().join('_')
  }

  logout() {
    this.authService.logout()
    this.selectedGroupId.set(undefined)
    this.conversation.set([])

    this.router.navigate(['/login'])
  }

}

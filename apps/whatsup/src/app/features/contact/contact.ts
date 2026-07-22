import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { ChatService } from '../chat/data-access/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  naam = input<string>()
  contactId = input.required<string>()

  protected chatService = inject(ChatService)
  private router = inject(Router)
  protected initialen = computed(() => this.naam()?.trim()
  .split(' ')
  .map((naam): string => naam[0])
  .join(' '))

  handleSelectContact(id: string) {
    this.chatService.selectedContactId.set(id)
    this.router.navigateByUrl('conversation')
  }
}

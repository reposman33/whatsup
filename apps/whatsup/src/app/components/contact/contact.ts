import { ChangeDetectionStrategy, Component, computed, inject, input, output, ViewEncapsulation } from '@angular/core';
import { RightClickEvent } from '@models/rightClickEvent';
import { ChatService } from '@services/index';

@Component({
  selector: 'contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  naam = input<string>()
  registrationTime = input.required<number>()
  onSelectContact = output<number>()
  onRightClick = output<RightClickEvent>()

  protected chatService = inject(ChatService)
  protected initialen = computed(() => this.naam()?.trim()
  .split(' ')
  .map((naam): string => naam[0])
  .join(' '))

  selectContact(registrationTime: number) {
    this.onSelectContact.emit(registrationTime)
  }
}

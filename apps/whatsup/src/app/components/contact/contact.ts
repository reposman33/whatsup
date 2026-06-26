import { ChangeDetectionStrategy, Component, computed, inject, input, output, ViewEncapsulation } from '@angular/core';
import { RightClickEvent } from '@models/rightClickEvent';
import { ChatService } from '@services/index';
import { ApiService } from '@services/index';

@Component({
  selector: 'contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  private apiService = inject(ApiService)
  onRightClick = output<RightClickEvent>()
  private chatService = inject(ChatService)

  naam = input<string>()
  registrationTime = input.required<number>()

  protected initialen = computed(() => this.naam()?.trim()
  .split(' ')
  .map((naam): string => naam[0])
  .join(' '))

  handleRightClick($event: RightClickEvent) {
    this.onRightClick.emit($event)
    $event.$event.preventDefault()
  }
  
  selectContact(registrationTime: number) {
    this.chatService.selectContact(registrationTime)
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, input, output, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RightClickEvent } from '@models/rightClickEvent';
import { ChatService } from '@services/index';
import { map } from 'rxjs';

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
  onRightClick = output<RightClickEvent>()
  private chatService = inject(ChatService)
  protected currentContactRegistrationTime = toSignal(
    this.chatService.currentContactRegistrationTime$.pipe(
      map(registrationTime => registrationTime?.registrationTime)
    )
  )

  protected initialen = computed(() => this.naam()?.trim()
  .split(' ')
  .map((naam): string => naam[0])
  .join(' '))


  // ngOnInit(){
  //   this.chatService.currentContactRegistrationTime$
  //   .subscribe (
  //     registrationTime => this.currentContactRegistrationTime = registrationTime?.registrationTime || 0
  //   )
  // }

  handleRightClick($event: RightClickEvent) {
    this.onRightClick.emit($event)
    $event.$event.preventDefault()
  }
  
  selectContact(registrationTime: number) {
    this.chatService.selectContact(registrationTime)
  }
}

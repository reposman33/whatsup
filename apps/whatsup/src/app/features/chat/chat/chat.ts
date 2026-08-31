import { ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';
import { Message } from '../../../models/message.model';
import { AuthService } from '../../../features/auth/data-access/auth.service';
import { UtilsService } from '../../../shared/services/utils-service/utilsService';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'chat',
  imports: [DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  chat = input.required<Message>()
  protected authService = inject(AuthService)
  protected utilsService = inject(UtilsService)
  private now = new Date()

  protected formattedTimestampNow = this.utilsService.getFormattedDateTime(this.now)

}

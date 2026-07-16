import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../features/auth/data-access/auth.service';
import { Router } from '@angular/router';
import { ChatService } from '../../../features/chat/data-access/chat-store';

@Component({
  selector: 'header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected authService = inject(AuthService)
  private router = inject(Router)
  private chatService = inject(ChatService)

  logout() {
    this.chatService.logout()
    this.router.navigateByUrl('/login');
  }
}

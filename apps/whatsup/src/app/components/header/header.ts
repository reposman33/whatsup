import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@services/AuthService/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected authService = inject(AuthService)
  private router = inject(Router)

  logout() {
    this.authService.logout()
    this.router.navigateByUrl('/login');
  }
}

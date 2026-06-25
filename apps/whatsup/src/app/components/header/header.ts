import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@services/AuthService/AuthService';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'header',
  imports: [AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected authService = inject(AuthService)
  private router = inject(Router)
  protected authenticated$ = this.authService.currentUser$

  logout() {
    this.authService.logout()
    this.router.navigateByUrl('/login');
  }
}

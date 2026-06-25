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
  private auth = inject(AuthService)
  private router = inject(Router)
  protected authenticated$ = this.auth.authenticated$

  logout() {
    this.auth.logout()
    this.router.navigateByUrl('/login');
  }
}

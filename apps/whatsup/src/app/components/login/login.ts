import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../shared/services/';
import { Router } from '@angular/router';
import password from '@primeuix/themes/nora/password';

@Component({
  selector: 'login',
  imports: [FormsModule, InputTextModule, PasswordModule, ButtonModule, CardModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private auth = inject(AuthService)
  private router = inject(Router)

  protected email = '';
  protected password = '';

  login() {
    this.auth.authenticate(this.email, this.password)

    if (this.auth.isAuthenticated()) {
      const target = this.auth.requestedUrl || '/whatsUp';
      this.router.navigateByUrl(target);
    } else {
      this.email = '';
      this.password = '';
    }
  }

  register() {
    this.auth.register(this.email, this.password);
  }
}

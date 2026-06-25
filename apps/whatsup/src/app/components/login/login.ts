import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@services/AuthService/AuthService';
import { Router } from '@angular/router';

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
  
  protected isRegistering = signal(false)
  protected email = signal('');
  protected password = signal('');
  protected gebruikersNaam = signal('');

  protected isValidRegistration = computed(() => this.email().length > 0 && this.password().length > 0 && this.gebruikersNaam().length > 0)

  ngOnInit() {
    this.auth.authenticated$.subscribe(isAuthenticated => isAuthenticated && this.router.navigateByUrl(''))
  }

  login() {
    this.auth.authenticate(this.email(), this.password())
    this.email.set('');
    this.password.set('');
  }

  register() {
    this.isRegistering.set(true)
    if(this.isValidRegistration()) {
      this.auth.register(this.email(), this.password(), this.gebruikersNaam());
      this.isRegistering.set(false)
    }
  }
}

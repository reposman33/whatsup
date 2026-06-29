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
  private authService = inject(AuthService)
  private router = inject(Router)
  
  protected isRegistering = signal(false)
  protected email = signal('');
  protected password = signal('');
  protected naam = signal('');

  protected isValidRegistration = computed(() => this.email().length > 0 && this.password().length > 0 && this.naam().length > 0)

  emptyRegistrationFields() {
    this.email.set('')
    this.password.set('')
    this.naam.set('')
  }

  ngOnInit() {
    if (this.authService.currentContact()) {
      this.router.navigateByUrl('')
    }
  }

  login() {
    this.authService.authenticate(this.email(), this.password())
    if (this.authService.currentContact()) {
      this.router.navigateByUrl('')
    }
    this.emptyRegistrationFields();
  }

  register() {
    this.isRegistering.set(true)
    if(this.isValidRegistration()) {
      this.authService.register({email: this.email(), password: this.password(), name: this.naam(), registrationTime: new Date().getTime()});
      this.isRegistering.set(false)
      // emptyRegistrationFields zodat isValidRegistration() === false
      this.emptyRegistrationFields()
    }
  }
}

import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, OnInit, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../data-access/auth.service';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { UtilsService } from '../../../shared/services/utils-service/utilsService';

@Component({
  selector: 'login',
  imports: [FormsModule, Button ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService)
  private utilsService = inject(UtilsService)
  private router = inject(Router)
  private inputEmail = viewChild<ElementRef<HTMLInputElement>>('inputEmail')
  
  protected isRegistering = signal(false)
  protected email = signal('');
  protected password = signal('');
  protected naam = signal('');
  protected errorText = signal('');

  protected isRegistrationValid = computed(() =>
    this.isRegistering() && this.email().length > 0 && this.password().length > 0 && this.naam().length > 0
  )

  protected isLoginValid = computed(() =>
    !this.isRegistering() && this.email().length > 0 && this.password().length > 0
  )

  constructor(){
    effect(():void =>
      this.inputEmail()?.nativeElement.focus()
    )
  }

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

  async login() {
    await this.authService.login(this.email(), this.password())
    .catch((e) => this.errorText.set(`Oops! er is iets misgegaan: ${e}`))
    if (this.authService.currentContact()) {
      this.router.navigateByUrl('')
    }
    this.emptyRegistrationFields();
  }

  async register() {
    this.isRegistering.set(true)
    if(this.isRegistrationValid()) {
      await this.authService.register({
        email: this.email(),
        password: this.password(),
        name: this.naam(),
        registrationTime: this.utilsService.getFormattedDateTime(new Date())
      });
      this.isRegistering.set(false)
      // emptyRegistrationFields zodat isRegistrationValid() === false
      this.emptyRegistrationFields()
    }
  }
}

import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RegisterAlertComponent } from '../register-alert/register-alert.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterOutlet, RegisterAlertComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  showPasswordFlag: boolean = false;
  error: string = '';


  registerForm = new FormGroup({
    registerDisplayName: new FormControl(''),
    registerUsername: new FormControl(''),
    registerPassword: new FormControl(''),
    registerPasswordValidate: new FormControl(''),
  });

  showPassword() {
      this.showPasswordFlag = !this.showPasswordFlag;
  }

  submitRegister() {
    if (!this.registerForm.value.registerDisplayName) {
      this.error = 'DISPLAY NAME EMPTY';
    } else if (!this.registerForm.value.registerUsername) {
      this.error = 'USERNAME EMPTY';
    } else if (!this.registerForm.value.registerPassword) {
      this.error = 'PASSWORD EMPTY';
    } else if (this.registerForm.value.registerPassword !== this.registerForm.value.registerPasswordValidate) {
      this.error = 'PASSWORDS DO NOT MATCH';
    }

    // check if username already registered
    console.log(this.registerForm.value.registerPassword ?? '');
  }
}

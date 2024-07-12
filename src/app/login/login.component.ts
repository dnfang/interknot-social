import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { LoginAlertComponent } from '../login-alert/login-alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterOutlet, LoginAlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  error: string = '';
  
  loginForm = new FormGroup({
    loginUsername: new FormControl(''),
    loginPassword: new FormControl(''),
  });

  submitLogin() {
    console.log(this.loginForm.value.loginPassword ?? '');
  }
}

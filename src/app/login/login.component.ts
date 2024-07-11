import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    loginUsername: new FormControl(''),
    loginPassword: new FormControl(''),
  });

  submitLogin() {
    console.log(this.loginForm.value.loginPassword ?? '');
  }
}

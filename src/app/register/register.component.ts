import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterOutlet],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  showPasswordFlag: boolean = false;
  
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
    console.log(this.registerForm.value.registerPassword ?? '');
  }
}

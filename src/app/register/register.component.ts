import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RegisterAlertComponent } from '../register-alert/register-alert.component';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  registerForm = new FormGroup({
    registerDisplayName: new FormControl(''),
    registerUsername: new FormControl(''),
    registerPassword: new FormControl(''),
    registerPasswordValidate: new FormControl(''),
  });

  showPassword() {
      this.showPasswordFlag = !this.showPasswordFlag;
  }

  checkUsernameRegistered(res: any, username: string): boolean {
    if (res.body.hasOwnProperty("_embedded")) {
      let usersList = res.body['_embedded']['userAccountList'];
      let user = usersList.find((u: { username: string; }) => u.username === username);

      if (user) {
        return true;
      }
      return false;
    }
    return false;
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
    } else {
      this.http.get('http://localhost:8080/users', {observe: 'response'}).subscribe((res: any) => {
        if (res.status === 200) {
          // find if username exists already
          if (this.checkUsernameRegistered(res, this.registerForm.value.registerUsername ?? '')) {
            this.error = 'USERNAME TAKEN';
            return
          } 
          let body = {
            username: this.registerForm.value.registerUsername,
            displayName: this.registerForm.value.registerDisplayName,
            password: this.registerForm.value.registerPassword
          }; 
          this.http.post('http://localhost:8080/users', body).subscribe(res => {
            // proceed to homepage
          });
        }
      });
    }
  }
}

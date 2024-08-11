import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { RegisterAlertComponent } from '../register-alert/register-alert.component';
import { HttpClient } from '@angular/common/http';
import { RequestsService } from '../requests.service';

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
  private requestsService = inject(RequestsService);

  constructor(private http: HttpClient, private router: Router) {}

  // Form for user registration
  registerForm = new FormGroup({
    registerDisplayName: new FormControl(''),
    registerUsername: new FormControl(''),
    registerPassword: new FormControl(''),
    registerPasswordValidate: new FormControl(''),
  });

  showPassword() {
      this.showPasswordFlag = !this.showPasswordFlag;
  }

  /**
   * Handles form submission for user registration.
   * Validates the form and checks if the username is already taken.
   * If validation passes and username is available, it registers the user.
   */
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
      this.requestsService.getUsers().subscribe(users => {
        // Fetch existing users to check if the username is already taken
        let user = users.find((u: { username: string; }) => u.username === this.registerForm.value.registerUsername);
        if (user) {
          this.error = 'USERNAME TAKEN';
          return;
        }
        // If username is available, proceed with registration
        let body = {
          username: this.registerForm.value.registerUsername,
          displayName: this.registerForm.value.registerDisplayName,
          password: this.registerForm.value.registerPassword
        }; 
        this.requestsService.addUser(body).subscribe(_ => {
          localStorage.setItem("username", body.username ?? '');
          this.router.navigate(['/']);
        })
      })
    }
  }
}

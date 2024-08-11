import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { LoginAlertComponent } from '../login-alert/login-alert.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterOutlet, LoginAlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  error: string = '';
  private requestsService = inject(RequestsService);

  constructor(private http: HttpClient, private router: Router) {}
  
  // form for user login with username and password fields
  loginForm = new FormGroup({
    loginUsername: new FormControl(''),
    loginPassword: new FormControl(''),
  });

  /**
   * Checks if the provided username is registered.
   * @param res The response containing user data.
   * @param username The username to check.
   * @returns True if the username is registered, false otherwise.
   */
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

  /**
   * Handles the login form submission.
   * Validates the form fields and performs authentication.
   */
  submitLogin() {
    // Check if the username is provided
    if (!this.loginForm.value.loginUsername) {
      this.error = 'USERNAME INVALID';
      return
    }
    this.requestsService.getUsers().subscribe(users => {
      // Find the user with the provided username
      let user = users.find((u: { username: string; }) => u.username === this.loginForm.value.loginUsername);
      if (!user) {
        this.error = 'USERNAME INVALID';
        return;
      }

      // Login request payload with user ID and password
      let id: number = user.id;
      let body = {
        id: id,
        password: this.loginForm.value.loginPassword
      }; 
      this.http.post('http://localhost:8080/login', body, {observe: 'response'}).pipe(
        // Handle errors during the login process
        catchError((error => {
          if (error instanceof HttpErrorResponse) {
            this.error = 'PASSWORD INVALID'
            return throwError(() => new Error('Password Invalid'))
          }
          return throwError(() => new Error('An error occurred'))
        }))
      ).subscribe((res: any) => {
        this.error = '';
        localStorage.setItem("username", this.loginForm.value.loginUsername ?? '');
        this.router.navigate(['/']);
        return
      })
    });
  }
}

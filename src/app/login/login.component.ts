import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { LoginAlertComponent } from '../login-alert/login-alert.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterOutlet, LoginAlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}
  
  loginForm = new FormGroup({
    loginUsername: new FormControl(''),
    loginPassword: new FormControl(''),
  });

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

  submitLogin() {
    if (!this.loginForm.value.loginUsername) {
      this.error = 'USERNAME INVALID';
      return
    }
    
    this.http.get('http://localhost:8080/users', {observe: 'response'}).subscribe((res: any) => {
      if (res.status === 200) {
        // find if username exists already
        if (!this.checkUsernameRegistered(res, this.loginForm.value.loginUsername ?? '')) {
          this.error = 'USERNAME INVALID';
          return
        }
        // get user id
        let usersList = res.body['_embedded']['userAccountList'];
        let user = usersList.find((u: { username: string; }) => u.username === this.loginForm.value?.loginUsername);
        let id: number = user.id;

        // send password to verify
        let body = {
          id: id,
          password: this.loginForm.value.loginPassword
        }; 
        this.http.post('http://localhost:8080/login', body, {observe: 'response'}).pipe(
          catchError((error => {
            if (error instanceof HttpErrorResponse) {
              this.error = 'PASSWORD INVALID'
              return throwError(() => new Error('Password Invalid'))
            }
            return throwError(() => new Error('An error occurred'))
          }))
        ).subscribe((res: any) => {
          this.error = '';
          this.router.navigate(['/']);
          return
        })
      }
    });
  }
}

import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navbarOpen: boolean = false;
  username: string = localStorage.getItem("username") ?? '';
  displayName: string | undefined;

  constructor(private router: Router, private http: HttpClient) {
    this.http.get('http://localhost:8080/users', {observe: 'response'}).subscribe((res: any) => {
      if (res.status === 200) {
        let usersList = res.body['_embedded']['userAccountList'];
        let user = usersList.find((u: { username: string; }) => u.username === this.username);
        this.displayName = user.displayName;
      }
    });
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  signout() {
    localStorage.setItem("username", '');
    this.router.navigate(['/login']);
  }

  profile() {
    this.router.navigate(['/profile', this.username]);
  }

  dashboard() {
    this.router.navigate(['/']);
  }

  messages() {
    this.router.navigate(['/messages']);
  }

  comissions() {
    this.router.navigate(['/comissions']);
  }
}

import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RequestsService } from '../requests.service';

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
  imgSrc: string = 'user.png'
  private requestsService = inject(RequestsService);

  constructor(private router: Router, private http: HttpClient) {
    this.requestsService.getUserDetails(localStorage.getItem("username") ?? '').subscribe((user: any) => {
      this.displayName = user.displayName;
      if (user.profilePictureUrl) {
        this.imgSrc = user.profilePictureUrl;
      }
    })
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

  commissions() {
    this.router.navigate(['/commissions']);
  }
}

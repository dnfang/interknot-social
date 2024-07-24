import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isAuthorised: boolean = false;
  postDropdownOpen: boolean = false;

  constructor(private router: Router) {
    let username: string = localStorage.getItem("username") ?? '';
    this.isAuthorised = username ? true : false;

    if (!this.isAuthorised) {
      this.router.navigate(['/login']);
    }
  }

  togglePostDropdown() {
    this.postDropdownOpen = !this.postDropdownOpen;
  }
}

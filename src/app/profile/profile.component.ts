import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  username: string = localStorage.getItem('username') ?? '';
  displayName: string | undefined;
  bioText: string = '';

  constructor(private http: HttpClient) {
    this.http.get('http://localhost:8080/users', {observe: 'response'}).subscribe((res: any) => {
      if (res.status === 200) {
        let usersList = res.body['_embedded']['userAccountList'];
        let user = usersList.find((u: { username: string; }) => u.username === this.username);
        this.displayName = user.displayName;
      }
    });
  }

  setBio(text: string) {
    this.bioText = text;
  }
}

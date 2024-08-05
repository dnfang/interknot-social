import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { RequestsService } from '../requests.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, NgClass, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  username: string = localStorage.getItem('username') ?? '';
  displayName: string = '';
  bioText: string = '';
  popupOpen: boolean = false;
  imgSrc: string | ArrayBuffer | null = 'user.png';
  id: number = 0;
  isAuthorised: boolean = false;
  private requestsService = inject(RequestsService);

  constructor(private http: HttpClient, private router: Router) {
    let username: string = localStorage.getItem("username") ?? '';
    this.isAuthorised = username ? true : false;
    if (!this.isAuthorised) {
      this.router.navigate(['/login']);
    }
    
    this.requestsService.getUserDetails(localStorage.getItem("username") ?? '').subscribe((user: any) => {
      this.displayName = user.displayName;
      this.bioText = user.bio;
      this.id = user.id;
      if (user.profilePictureUrl) {
        this.imgSrc = user.profilePictureUrl;
      }
    });
  }

  profileForm = new FormGroup({
    editDisplayName: new FormControl(''),
    editBio: new FormControl(''),
  });

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imgSrc = reader.result;

        let body = {
          displayName: this.displayName,
          profilePictureUrl: this.imgSrc,
          bio: this.bioText,
        }
        this.requestsService.updateUser(body, this.id);
      }

      reader.readAsDataURL(file);
    }
  }

  setBio(text: string) {
    this.bioText = text;
  }

  togglePopup() {
    this.popupOpen = !this.popupOpen;
  }

  submitDisplayName() {
    this.displayName = this.profileForm.value.editDisplayName ?? '';
    let body = {
      displayName: this.displayName,
      profilePictureUrl: this.imgSrc,
      bio: this.bioText,
    }
    this.requestsService.updateUser(body, this.id);
  }

  submitBio() {
    this.bioText = this.profileForm.value.editBio ?? '';
    let body = {
      displayName: this.displayName,
      profilePictureUrl: this.imgSrc,
      bio: this.bioText,
    }
    this.requestsService.updateUser(body, this.id);
  }
}

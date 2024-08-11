import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RequestsService } from '../requests.service';
import { PostPreviewCardComponent } from '../post-preview-card/post-preview-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, PostPreviewCardComponent, NgClass, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isAuthorised: boolean = false;
  postDropdownOpen: boolean = false;
  postError: string = '';
  createPostOpen: boolean = false;
  imgSrc: string | ArrayBuffer | null = '';
  displayName: string = '';
  private requestsService = inject(RequestsService);
  postList: any[] = [];

  constructor(private router: Router) {
    let username: string = localStorage.getItem("username") ?? '';
    this.isAuthorised = username ? true : false;

    if (!this.isAuthorised) {
      this.router.navigate(['/login']);
    }

    this.requestsService.getUserDetails(username).subscribe((res: any) => {
      this.displayName = res.displayName;
    })

    this.requestsService.getPosts().subscribe((res: any) => {
      for (let i = 0; i < res.length; i++) {
        this.postList.push(res[i])
      }
    })
  }

  // Form for post creation
  postForm = new FormGroup({
    postType: new FormControl(''),
    postTitle: new FormControl(''),
    postText: new FormControl(''),
  });

  // Handles image file selection and updates imgSrc with the image data
  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      // On successful file read, update imgSrc with image data URL
      reader.onload = () => {
        this.imgSrc = reader.result;
      }

      reader.readAsDataURL(file);
    }
  }

  togglePostDropdown() {
    this.postDropdownOpen = !this.postDropdownOpen;
  }

  toggleCreatePost() {
    this.createPostOpen = !this.createPostOpen;
  }

  // Handles post submission by validating the form and sending data to the server
  submitPost() {
    // Validate form fields and set appropriate error messages
    if (!this.postForm.value.postType) {
      this.postError = 'INVALID_POST_TYPE';
      return
    } else if (!this.postForm.value.postTitle) {
      this.postError = 'EMPTY_POST_TITLE';
      return
    } else if (!this.postForm.value.postText) {
      this.postError = 'EMPTY_POST_TEXT';
      return
    } else if (!this.imgSrc) {
      this.postError = 'INVALID_IMAGE';
      return
    }

    // Post data
    let body = {
      thumbnailUrl: this.imgSrc,
      title: this.postForm.value.postTitle,
      content: this.postForm.value.postText,
      displayName: this.displayName,
      username: localStorage.getItem("username"),
      postType: this.postForm.value.postType,
      views: 0,
      client: '',
    }

    // Send post data to the server
    this.requestsService.addPost(body).subscribe((res: any) => {
      this.toggleCreatePost();
      this.postError = '';
      this.imgSrc = '';
      this.postForm = new FormGroup({
        postType: new FormControl(''),
        postTitle: new FormControl(''),
        postText: new FormControl(''),
      });

      // Fetch updated posts and add the newly created post to the list
      this.requestsService.getPosts().subscribe((res: any) => {
        let post = res.pop();
        if (post) {
          this.postList.push(post);
        }
      })
    });
  }
}

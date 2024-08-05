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
      console.log(this.postList)
    })
  }

  postForm = new FormGroup({
    postType: new FormControl(''),
    postTitle: new FormControl(''),
    postText: new FormControl(''),
  });

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

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

  submitPost() {
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
    this.requestsService.addPost(body).subscribe((res: any) => {
      this.toggleCreatePost();
      this.postError = '';
      this.imgSrc = '';
      this.postForm = new FormGroup({
        postType: new FormControl(''),
        postTitle: new FormControl(''),
        postText: new FormControl(''),
      });

      this.requestsService.getPosts().subscribe((res: any) => {
        let post = res.pop();
        if (post) {
          this.postList.push(post);
        }
      })
    });
  }
}

import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { RequestsService } from '../requests.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post-preview-card',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './post-preview-card.component.html',
  styleUrl: './post-preview-card.component.css'
})
export class PostPreviewCardComponent implements OnInit {
  @Input({required: true}) id!: number;
  views: number = 0;
  @Input({required: true}) thumbnail!: string;
  profilePic: string = 'user.png';
  @Input({required: true}) username!: string;
  @Input({required: true}) displayName!: string;
  @Input({required: true}) title!: string;
  @Input({required: true}) content!: string;
  @Input({required: true}) type!: string;
  @Input({required: true}) client!: string;
  private requestsService = inject(RequestsService);

  ngOnInit() {
    this.requestsService.getUserDetails(this.username).subscribe((user: any) => {
      if (user.profilePictureUrl) {
        this.profilePic = user.profilePictureUrl;
      }
    })

    this.requestsService.getPostDetails(this.id).subscribe((post: any) => {
      this.views = post.views;
    })
  }

  constructor(private http: HttpClient, private router: Router) {
  }

  setViews() {
    this.views += 1;
  }

  post() {
    let body = {
      thumbnailUrl: this.thumbnail,
      title: this.title,
      content: this.content,
      views: this.views += 1,
      client: this.client,
    }
    this.requestsService.updatePost(body, this.id);
    this.router.navigate(['/post', this.id]);
  }


}

import { Component, inject, Input, OnInit } from '@angular/core';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  @Input({required: true}) postId!: number;
  @Input({required: true}) commentId!: number;
  @Input({required: true}) username!: string;
  @Input({required: true}) displayName!: number;
  @Input({required: true}) content!: string;
  profilePic: string = 'user.png';
  private requestsService = inject(RequestsService);

  ngOnInit(): void {
    this.requestsService.getUserDetails(this.username).subscribe((user: any) => {
      if (user.profilePictureUrl) {
        this.profilePic = user.profilePictureUrl;
      }
    })
  }

  constructor() {
  }
}

import { Component, inject } from '@angular/core';
import { CommentComponent } from '../comment/comment.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RequestsService } from '../requests.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommentComponent, NavbarComponent, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  id: number = parseInt(this.route.snapshot.params['id'], 10);
  displayName: string = '';
  username: string = '';
  likes: number = 0;
  thumbnail: string | ArrayBuffer | null = '';
  profileImg: string = 'user.png';
  title: string = '';
  content: string = '';
  commentList: any[] = [];
  views: number = 0;
  private requestsService = inject(RequestsService);
  likeStatus: boolean = false;
  likesList: any[] = [];
  postType: string = '';
  client: string = '';
  currentUser: string = '';

  constructor() {
    this.currentUser = localStorage.getItem("username") ?? '';

    this.requestsService.getComments().subscribe((comments: any) => {
      this.commentList = comments.filter((c: { postId: number; }) => c.postId === this.id)
    });

    // Fetch and initialize likes for this post and check if the current user has liked the post
    this.requestsService.getLikes().subscribe((likes: any) => {
      this.likesList = likes;
      this.likes = this.likesList.length
      let likeObj = this.likesList.find((l: { postId: number; username: string; }) => l.username === localStorage.getItem("username") && l.postId === this.id);
      if (likeObj) {
        this.likeStatus = true;
      }
    });

    this.requestsService.getPostDetails(this.id).subscribe((post: any) => {
      this.displayName = post.displayName;
      this.thumbnail = post.thumbnailUrl;
      this.title = post.title;
      this.content = post.content;
      this.views = post.views;
      this.username = post.username;
      this.postType = post.postType;
      
      if (post.client) {
        this.client = post.client;
      }

      this.requestsService.getUserDetails(this.username).subscribe((user: any) => {
        if (user.profilePictureUrl) {
          this.profileImg = user.profilePictureUrl;
        }
      })
    })

  }

  // Form for comment submission
  commentForm = new FormGroup({
    commentText: new FormControl(''),
  });

  /**
   * Toggles the like status of the post and updates the server accordingly.
   * Adds or removes a like based on the current like status.
   */
  like() {
    this.likeStatus = !this.likeStatus;
    if (this.likeStatus) { 
      // Add a like if the post is not already liked by the user
      this.requestsService.getUserDetails(localStorage.getItem("username") ?? '').subscribe((user: any) => {
        let body = {
          userId: user.id,
          displayName: user.displayName,
          username: user.username,
          postId: this.id
        }
        this.requestsService.addLike(body);
        this.likesList.push(body);
        this.likes += 1;
      })
    } else {
      // Remove the like if the post was already liked by the user
      this.requestsService.getUserDetails(localStorage.getItem("username") ?? '').subscribe((user: any) => {
        this.requestsService.getLikes().subscribe((likes: any) => {
          let likeObj = likes.find((l: { postId: number; username: string; }) => l.username === user.username && l.postId === this.id);
          this.likesList = this.likesList.filter(like => like.username !== likeObj.username && like.postId !== this.id);
          this.likes = this.likes - 1;
          this.requestsService.deleteLike(likeObj.likeId)
        })
      })
    }
  }

  /**
   * Submits a new comment on the post.
   * Validates the comment and updates the server and local list of comments.
   */
  submitComment() {
    if (!this.commentForm.value.commentText) {
      return
    }

    this.requestsService.getUserDetails(localStorage.getItem("username") ?? '').subscribe((user: any) => {
      let comment = {
        displayName: user.displayName,
        username: user.username,
        content: this.commentForm.value.commentText,
        postId: this.id
      };
      this.commentList.push(comment);
      this.requestsService.addComment(comment);
  
      this.commentForm = new FormGroup({
        commentText: new FormControl(''),
      });
  
    })
  }

  /**
   * Accepts the commission for the post.
   * Updates the post with the current client information.
   */
  acceptCommission() {
    this.client = localStorage.getItem("username") ?? '';
    let body = {
      thumbnailUrl: this.thumbnail,
      title: this.title,
      content: this.content,
      views: this.views,
      client: this.client,
    }
    this.requestsService.updatePost(body, this.id);
  }
}

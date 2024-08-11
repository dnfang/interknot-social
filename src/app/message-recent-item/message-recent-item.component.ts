import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-message-recent-item',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './message-recent-item.component.html',
  styleUrl: './message-recent-item.component.css'
})
export class MessageRecentItemComponent implements OnInit, OnChanges {
  @Input({required: true}) id!: number;
  @Input({required: true}) userId!: number;
  @Input({required: true}) username!: string;
  @Input({required: true}) displayName!: string;
  @Input({required: true}) message!: string;
  senderProfilePic: string = 'user.png';

  private requestsService = inject(RequestsService);

  ngOnInit(): void {
    this.requestsService.getUserDetails(this.username).subscribe((user:any) => {
      if (user.profilePictureUrl) {
        this.senderProfilePic = user.profilePictureUrl;
      }
    })
  }

  constructor() {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username'] && this.username) {
      this.requestsService.getUserDetails(this.username).subscribe((user:any) => {
        if (user.profilePictureUrl) {
          this.senderProfilePic = user.profilePictureUrl;
        } else {
          this.senderProfilePic = 'user.png'
        }
      })
    }
  }
}

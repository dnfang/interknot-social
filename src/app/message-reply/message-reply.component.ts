import { Component, inject, Input, OnInit  } from '@angular/core';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-message-reply',
  standalone: true,
  imports: [],
  templateUrl: './message-reply.component.html',
  styleUrl: './message-reply.component.css'
})
export class MessageReplyComponent implements OnInit {
  @Input({required: true}) content!: string;
  @Input({required: true}) username!: string;
  
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

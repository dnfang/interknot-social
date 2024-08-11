import { Component, inject } from '@angular/core';
import { RequestsService } from '../requests.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageRecentItemComponent } from '../message-recent-item/message-recent-item.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MessageReplyComponent } from '../message-reply/message-reply.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [ReactiveFormsModule, MessageRecentItemComponent, NavbarComponent, MessageReplyComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  messageReplies: any[] = [];
  messageLog: any[] = [];
  receiverDisplayName: string = '';
  receiverUsername: string = '';
  receiverId: number | undefined;
  senderId: number | undefined;
  senderDisplayName: string = '';
  senderUsername: string = '';
  senderProfilePic: string = 'user.png';
  filteredUsers: any[] = [];
  users: any[] = [];
  private requestsService = inject(RequestsService);

  // Form for searching users to message
  searchForm = new FormGroup({
      searchTerm: new FormControl(''),
  });

  constructor() {   
    this.requestsService.getUsers().subscribe((users: any) => {
      this.users = users;
    })
    
    this.requestsService.getUserDetails(localStorage.getItem("username") ?? '').subscribe((user: any) => {
      this.senderId = user.id;
      this.senderDisplayName = user.displayName;
      this.senderUsername = user.username;
      if (user.profilePictureUrl) {
        this.senderProfilePic = user.profilePictureUrl;
      }

      this.refreshRecentReplies();
    })
  }

  /**
   * Refreshes the list of recent message replies.
   * Fetches messages and filters out the most recent replies for each conversation.
   */
  refreshRecentReplies() {
    this.requestsService.getMessages().subscribe((res: any) => {
      let messages = res;

      const parseDate = (dateString: string): Date => new Date(dateString);

      const getMostRecentReplies = (messages: any[]): Map<string, any> => {
        const recentReplies = new Map<string, any>();
  
        for (const message of messages) {
          let existing: any = recentReplies.get(message.senderUsername);

          // Update map with most recent message from sender
          if ((!existing && message.receiverUsername === this.senderUsername) || (existing && parseDate(message.timestamp) > parseDate(existing.timestamp) && message.receiverUsername === this.senderUsername)) {
              recentReplies.set(message.senderUsername, message);
          }

          // Update map with most recent message from receiver
          existing = recentReplies.get(message.receiverUsername);
          if ((!existing && message.senderUsername === this.senderUsername) || (existing && parseDate(message.timestamp) > parseDate(existing.timestamp) && message.senderUsername === this.senderUsername)) {
              recentReplies.set(message.receiverUsername, message);
          }
        }
        return recentReplies;
      };

      // Filter messages to include only the most recent reply from each conversation
      const recentReplies = getMostRecentReplies(messages);
      const sortedMessages = [...messages].filter(m => {
        if (recentReplies.get(m.senderUsername) && m.messageId === recentReplies.get(m.senderUsername).messageId) {
          return m
        } else if (recentReplies.get(m.receiverUsername) && m.messageId === recentReplies.get(m.receiverUsername).messageId) {
          m.senderUsername = m.receiverUsername;
          m.senderId = m.receiverId;
          m.senderDisplayName = m.receiverDisplayName;
          
          return m
        }
      }).sort((a, b) => {
          const dateA = parseDate(recentReplies.get(a.senderUsername)?.timestamp || '');
          const dateB = parseDate(recentReplies.get(b.senderUsername)?.timestamp || '');
          return dateB.getTime() - dateA.getTime();
      });

      this.messageReplies = sortedMessages;
    })
  }

  // Form for replying to messages
  replyForm = new FormGroup({
      replyMessage: new FormControl(''),
  });

  /**
   * Handles user selection for messaging.
   * Sets receiver details and prepares message log.
   * @param id Receiver's ID
   * @param displayName Receiver's display name
   * @param username Receiver's username
   */
  displayUser(id: number, displayName: string, username: string) {
    this.searchForm = new FormGroup({
      searchTerm: new FormControl(''),
    });
    this.filteredUsers = [];

    // Set receiver details and fetch message history
    this.viewMessage(id, username, displayName)

  }

  /**
   * Filters users based on search term.
   * Updates the list of filtered users to display search results.
   */
  onSearch() { 
    if (this.searchForm.value.searchTerm === '') {
      this.filteredUsers = [];
      return
    }
    this.filteredUsers = this.users.filter(u => (u.username.toLowerCase().includes(this.searchForm.value.searchTerm?.toLowerCase() ?? '')) || (u.displayName.toLowerCase().includes(this.searchForm.value.searchTerm?.toLowerCase() ?? '')))
  }

  /**
   * Fetches and displays message history between the sender and receiver.
   * @param id Receiver's ID
   * @param username Receiver's username
   * @param displayName Receiver's display name
   */
  viewMessage(id: number, username: string, displayName: string) {
    this.receiverId = id;
    this.receiverUsername = username;
    this.receiverDisplayName = displayName;

    this.messageLog = [];

    // Fetch and filter messages between sender and receiver
    this.requestsService.getMessages().subscribe((messages: any) => {
      this.messageLog = [...messages].filter(m => (m.senderId === this.receiverId && m.receiverId === this.senderId) || (m.senderId === this.senderId && m.receiverId === this.receiverId))
    })
  }

  // Fetch and filter messages between sender and receiver
  submitReply() {
    if (!this.replyForm.value.replyMessage) {
      return
    }

    let currentTime = new Date();
    let body = {
      senderUsername: localStorage.getItem("username") ?? '',
      senderDisplayName: this.senderDisplayName,
      senderId: this.senderId,
      receiverUsername: this.receiverUsername,
      receiverDisplayName: this.receiverDisplayName,
      receiverId: this.receiverId,
      content: this.replyForm.value.replyMessage,
      timestamp: currentTime.toISOString(),
    }
    this.requestsService.addMessage(body).subscribe((res: any) => {
      this.requestsService.getMessages().subscribe((messages: any) => {
        let msg = messages.pop();
        if (msg) {
          this.messageLog.push(msg);
        }

        this.refreshRecentReplies();
      })
    })

    this.replyForm = new FormGroup({
      replyMessage: new FormControl(''),
  });
  }

}

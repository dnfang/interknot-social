import { Component, inject } from '@angular/core';
import { RequestsService } from '../requests.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commission',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './commission.component.html',
  styleUrl: './commission.component.css'
})
export class CommissionComponent {
  postList: any[] = [];
  currentUser: string = localStorage.getItem("username") ?? '';
  commissionOption: string = 'YOUR_COMMISSIONS';
  isAuthorised: boolean = false;
  private requestsService = inject(RequestsService);


  constructor(private router: Router) {
    this.isAuthorised = this.currentUser ? true : false;

    if (!this.isAuthorised) {
      this.router.navigate(['/login']);
    }

    this.requestsService.getPosts().subscribe((posts: any) => {
      this.postList = posts.filter((post: { username: string; postType: string; }) => post.username === this.currentUser && post.postType === "Commission");
    })
  }

  yourCommissions() {
    this.commissionOption = 'YOUR_COMMISSIONS';
    this.requestsService.getPosts().subscribe((posts: any) => {
      this.postList = posts.filter((post: { username: string; postType: string; }) => post.username === this.currentUser && post.postType === "Commission");
    })
  }

  acceptedCommissions() {
    this.commissionOption = 'ACCEPTED_COMMISSIONS';
    this.requestsService.getPosts().subscribe((posts: any) => {
      this.postList = posts.filter((post: { client: string; }) => post.client === this.currentUser);
    })
  }

  viewCommission(id: number) {
    this.router.navigate(['/post', id]);
  }
}

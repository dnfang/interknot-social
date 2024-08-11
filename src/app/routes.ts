import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProfileComponent } from "./profile/profile.component";
import { PostComponent } from "./post/post.component";
import { CommissionComponent } from "./commission/commission.component";
import { MessageComponent } from "./message/message.component";

const routeConfig: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'Dashboard | Inter-Knot',
  },  
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login to Inter-Knot',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register an Inter-Knot account',
  },
  {
    path: 'profile/:username',
    component: ProfileComponent,
    title: 'Profile | Inter-Knot',
  },
  {
    path: 'post/:id',
    component: PostComponent,
    title: 'Post | Inter-Knot',
  },
  {
    path: 'commissions',
    component: CommissionComponent,
    title: 'Comissions | Inter-Knot',
  },
  {
    path: 'messages',
    component: MessageComponent,
    title: 'Messages | Inter-Knot',
  },
];
export default routeConfig;
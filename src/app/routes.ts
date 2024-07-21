import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

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
  ];
  export default routeConfig;
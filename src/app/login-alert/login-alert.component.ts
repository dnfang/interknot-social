import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-login-alert',
  standalone: true,
  imports: [],
  templateUrl: './login-alert.component.html',
  styleUrl: './login-alert.component.css'
})
export class LoginAlertComponent {
  @Input({required: true}) message!: string;
}

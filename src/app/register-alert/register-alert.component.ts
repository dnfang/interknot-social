import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-register-alert',
  standalone: true,
  imports: [],
  templateUrl: './register-alert.component.html',
  styleUrl: './register-alert.component.css'
})
export class RegisterAlertComponent {
  @Input({required: true}) message!: string;
}

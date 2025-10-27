import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  email: string = '';
  message: string = '';
  constructor(private api: ApiService) {

  }
  subscribe() {
    if (!this.email) {
      this.message = 'Please enter your email!';
      return;
    }

    this.api.post('subscribe.php', { email: this.email }).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Subscribed successfully!';
        this.email = ''; // Clear input
        setTimeout(() => this.message = '', 1000);
      },
      error: (err) => {
        console.error(err);
        this.message = 'Subscription failed. Try again.';
        setTimeout(() => this.message = '', 1000);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  homeContent: any = null;
  loading = true;
  error: string | null = null;
  baseUrl = '';

  constructor(private api: ApiService) {
    this.baseUrl = this.api.getBaseUrl();
  }

  ngOnInit() {
    this.loadHomeContent();
  }

  loadHomeContent() {
    this.api.get<any[]>('home_content.php')
      .subscribe({
        next: (data) => {
          // Filter for active content only
          const activeContent = data.find(item => item.status === 'active');
          this.homeContent = activeContent || null;
          this.loading = false;
        },
        error: (err) => {
          console.error('API error:', err);
          this.error = 'Failed to load content';
          this.loading = false;
        }
      });
  }

}

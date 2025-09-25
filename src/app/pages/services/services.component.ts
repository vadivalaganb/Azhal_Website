import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  serviceContents: any[] = [];
  loading = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.apiService.getServiceContents().subscribe({
      next: (res) => {
        this.serviceContents = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading services', err);
        this.loading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;

  constructor(private route: ActivatedRoute, public api: ApiService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.api.getProducts().subscribe({
        next: (data: any[]) => {
          this.product = data.find(p => p.id == id);
          // console.log('Selected Product:', this.product);
        },
        error: (error) => console.error('Error loading product:', error)
      });
    }
  }
}

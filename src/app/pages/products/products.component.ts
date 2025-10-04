import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';
declare var $: any;
declare var WOW: any;
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  products: any[] = []; // store products from backend
  testimonials: any[] = [];
  baseUrl = '';
  constructor(private apiService: ApiService) {
    this.baseUrl = this.apiService.getBaseUrl();
  }

  ngOnInit(): void {
    new WOW().init();

    $('.owl-carousel').owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      autoplayTimeout: 3000,
      items: 1
    });
    this.loadProducts();
    this.loadTestimonials();

  }

  loadProducts(): void {
    this.apiService.getProducts().subscribe((data) => {
      this.products = data;
      console.log(this.products); // check the structure from backend
    });
  }
  loadTestimonials(): void {
    this.apiService.getTestimonials().subscribe({
      next: (res) => {
        this.testimonials = (res || [])
          .filter(item => +item.status === 1)
          .map(item => ({
            name: item.name,
            profession: item.profession,
            message: item.message,
            image: item.image && item.image !== ''
              ? this.baseUrl.replace(/\/+$/, '') + '/' + item.image.replace(/^\/+/, '')
              : 'assets/default-profile.png'
          }));

        setTimeout(() => {
          ($('.testimonial-carousel') as any).owlCarousel({
            loop: true,
            margin: 30,
            autoplay: true,
            autoplayTimeout: 4000,
            items: 3,
            center: true,
            nav: true,
            navText: ['<', '>'],
            rewind: true,
            responsive: {
              0: { items: 1 },
              768: { items: 2 },
              992: { items: 3 }
            }
          });
        }, 0);
      },
      error: (err) => console.error(err)
    });
  }
}

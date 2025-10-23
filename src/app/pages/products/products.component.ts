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
  teamMembers: any[] = [];
  internTestimonials: any[] = [];
  clientTestimonials: any[] = [];
  baseUrl = '';
  showFullText = false;
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
    this.apiService.getProducts().subscribe((data: any[]) => {
      // Add showFullText property for each product
      this.products = data.map(product => ({
        ...product,
        showFullText: false
      }));
      console.log(this.products); // Check structure
    });
  }

  loadTestimonials(): void {
    this.apiService.getTestimonials().subscribe({
      next: (res) => {
        const all = (res || []).filter(item => +item.status === 1);

        this.internTestimonials = all
          .filter(item => item.type === 'intern')
          .map(item => ({
            name: item.name,
            profession: item.profession,
            message: item.message,
            image: item.image && item.image !== ''
              ? this.baseUrl.replace(/\/+$/, '') + '/' + item.image.replace(/^\/+/, '')
              : 'assets/default-profile.png'
          }));

        this.clientTestimonials = all
          .filter(item => item.type === 'client')
          .map(item => ({
            name: item.name,
            profession: item.profession,
            message: item.message,
            image: item.image && item.image !== ''
              ? this.baseUrl.replace(/\/+$/, '') + '/' + item.image.replace(/^\/+/, '')
              : 'assets/default-profile.png'
          }));

        // Initialize carousels separately
        setTimeout(() => {
          // Intern Carousel
          const internCount = $('.intern-carousel .item').length;
          if (internCount) {
            ($('.intern-carousel') as any).owlCarousel({
              loop: internCount > 1,
              margin: 30,
              autoplay: true,
              autoplayTimeout: 4000,
              items: 1,
              center: true,
              nav: internCount > 1,
              navText: ['<', '>'],
              rewind: true,
              responsive: {
                0: { items: 1 },
                768: { items: 1 },
                992: { items: 1 }
              }
            });
          }

          // Client Carousel
          const clientCount = $('.client-carousel .item').length;
          if (clientCount) {
            ($('.client-carousel') as any).owlCarousel({
              loop: clientCount > 1,
              margin: 30,
              autoplay: true,
              autoplayTimeout: 4000,
              items: 1,
              center: true,
              nav: clientCount > 1,
              navText: ['<', '>'],
              rewind: true,
              responsive: {
                0: { items: 1 },
                768: { items: 1 },
                992: { items: 1 }
              }
            });
          }
        }, 500);

      },
      error: (err) => console.error(err)
    });
  }
  toggleText(index: number): void {
    this.products[index].showFullText = !this.products[index].showFullText;
  }
}

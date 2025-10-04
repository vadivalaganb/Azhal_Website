import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';
declare var $: any;
declare var WOW: any;
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
    this.loadServices();
    this.loadTestimonials();
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

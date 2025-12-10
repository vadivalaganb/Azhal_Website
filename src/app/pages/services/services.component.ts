import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
declare var $: any;
declare var WOW: any;
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  serviceContents: any[] = [];
  loading = false;
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
    this.loadServices();
    this.loadTestimonials();
  }

  loadServices(): void {
    this.loading = true;
    this.apiService.getServiceContents().subscribe({
      next: (res: any[]) => {
        // Add showFullText property for each service
        this.serviceContents = (res || []).map(service => ({
          ...service,
          showFullText: false
        }));
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
  toggleServiceText(index: number): void {
    this.serviceContents[index].showFullText = !this.serviceContents[index].showFullText;
  }

}

// inside your component's initialization (e.g., ngOnInit or onMount)

const triggerEl = document.querySelector('#client-tab');

if (triggerEl) {
  triggerEl.addEventListener('shown.bs.tab', (event) => {
    // This code runs every time the tab is clicked and shown
    console.log('Reviews tab is now visible!');
    
    // Call your function to load data here
    loadClientReviews(); 
  });
}

// Example function to load data
function loadClientReviews() {
    console.log('Fetching reviews from the server...');
}

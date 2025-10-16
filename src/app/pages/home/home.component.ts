import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/services/api.service';
import { RouterLink } from '@angular/router';
declare var $: any;
declare var WOW: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  sections: any[] = [];
  itemsMap: { [sectionId: string]: any[] } = {};
  homeContent: any = null;
  loading = true;
  error: string | null = null;
  baseUrl = '';
  serviceContents: any[] = [];
  teamMembers: any[] = [];
  internTestimonials: any[] = [];
  clientTestimonials: any[] = [];

  constructor(private api: ApiService) {
    this.baseUrl = this.api.getBaseUrl();
  }

  ngOnInit() {
    new WOW().init();

    $('.owl-carousel').owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      autoplayTimeout: 3000,
      items: 1
    });
    this.loadHomeContent();
    this.loadSections();
    this.loadServiceSection();
    this.loadTeamMembers();
    this.loadTestimonials();
  }

  loadHomeContent() {
    this.loading = true;
    this.api.getHomeContent().subscribe({
      next: (data) => {
        const activeContent = data.find(item => +item.status === 1);
        this.homeContent = activeContent || null;
        this.loading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        this.error = 'Failed to load content';
        setTimeout(() => this.error = '', 1000);
        this.loading = false;
      }
    });
  }
  loadSections(): void {
    this.api.getAboutSections().subscribe({
      next: (sections) => {
        this.sections = sections;

        // For each section, fetch its items
        sections.forEach(sec => {
          this.loadItems(sec.id);
        });
      },
      error: (err) => console.error('Failed to load sections', err)
    });
  }

  loadItems(sectionId: string | number): void {
    this.api.getAboutItems(Number(sectionId)).subscribe({
      next: (items) => this.itemsMap[sectionId] = items,
      error: (err) => console.error('Failed to load items for section', sectionId, err)
    });
  }
  loadServiceSection(): void {
    this.api.getServiceContents().subscribe({
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
  loadTeamMembers() {
    this.api.getTeamMembers().subscribe({
      next: (res) => {
        this.teamMembers = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  loadTestimonials(): void {
    this.api.getTestimonials().subscribe({
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

}

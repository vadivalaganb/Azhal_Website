import { AfterViewInit, Component, HostListener } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';

declare var $: any;
declare var WOW: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  loading = false;
  showBackToTop = false;
  isSticky: boolean | undefined;
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.initAnimations();
        this.initCarousels();
      });
  }

  ngAfterViewInit(): void {
    this.initAnimations();
    this.initCarousels();
  }

  private initAnimations() {
    new WOW().init();
  }
  private initCarousels() {
    setTimeout(() => {
      if ($('.client-carousel').length) {
        $('.client-carousel').owlCarousel('destroy');
        $('.client-carousel').owlCarousel({
          loop: true,
          margin: 30,
          autoplay: true,
          autoWidth: true,
          autoplayTimeout: 2000,
          responsive: {
            0: { items: 2 },
            600: { items: 4 },
            1000: { items: 6 }
          }
        });
      }

      if ($('.testimonial-carousel').length) {
        $('.testimonial-carousel').owlCarousel('destroy');
        $('.testimonial-carousel').owlCarousel({
          center: true,
          autoplay: true,
          smartSpeed: 1000,
          margin: 24,
          dots: true,
          loop: true,
          nav: true,
          navText: [
            '<i class="fa fa-chevron-left"></i>',
            '<i class="fa fa-chevron-right"></i>'
          ],
          responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
          }
        });
      }
    }, 0);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY;
    this.isSticky = scrollTop > 45;
    this.showBackToTop = scrollTop > 100;
  }

  backToTop(event: Event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}

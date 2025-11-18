import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isSticky = false;
  isMobile = false;

  ngOnInit() {
    this.isMobile = window.innerWidth < 768; // mobile breakpoint
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Sticky only for desktop
    if (!this.isMobile) {
      this.isSticky = scrollTop > 45;
    } else {
      this.isSticky = true; // always sticky for mobile
    }
  }

  // isSticky = false;
  // showBackToTop = false;

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  //   this.isSticky = scrollTop > 45;
  //   this.showBackToTop = scrollTop > 100;
  // }
}

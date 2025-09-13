import { NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterModule, NgClass],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isSticky = false;
  showBackToTop = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isSticky = scrollTop > 45;
    this.showBackToTop = scrollTop > 100;
  }
}

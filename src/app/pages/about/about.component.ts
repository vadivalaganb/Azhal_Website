import { AfterViewInit, Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

declare var $: any;
declare var WOW: any;

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    new WOW().init();

    $('.owl-carousel').owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      autoplayTimeout: 3000,
      items: 1
    });
  }
}

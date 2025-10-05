import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-under-construction',
    standalone: true,
    imports: [RouterLink],
    template: `
   <div class="container-xxl bg-primary page-header">

    </div>
    <div class="container text-center py-6">
      <i class="bi bi-tools display-1 text-warning"></i>
      <h1 class="display-4">Page Under Construction</h1>
      <p class="mb-4">We’re working hard to bring you this page. Please check back soon!</p>
      <a routerLink="" class="btn btn-primary rounded-pill py-3 px-5">Go Back Home</a>
    </div>
  `,
    styles: [`
    .page-header {
    margin-bottom: 0rem;
    padding: 0rem 0 6rem;
}
`]
})
export class UnderConstructionComponent { }

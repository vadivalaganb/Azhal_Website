import { AfterViewInit, Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-features',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent implements AfterViewInit {
  sections: any[] = [];
  itemsMap: { [sectionId: string]: any[] } = {}; // Map items by section
  baseUrl = '';

  constructor(private apiService: ApiService) {
    this.baseUrl = this.apiService.getBaseUrl();
  }

  ngAfterViewInit() {
    this.loadSections();
  }

  loadSections(): void {
    this.apiService.getAboutSections().subscribe({
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
    this.apiService.getAboutItems(Number(sectionId)).subscribe({
      next: (items) => this.itemsMap[sectionId] = items,
      error: (err) => console.error('Failed to load items for section', sectionId, err)
    });
  }
}

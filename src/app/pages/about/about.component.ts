import { AfterViewInit, Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
declare var $: any;
declare var WOW: any;
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit {
  sections: any[] = [];
  teamMembers: any[] = [];
  itemsMap: { [sectionId: string]: any[] } = {}; // Map items by section
  baseUrl = '';
  show: boolean = false;
  internMembers: any[] = [];
  activeTab: 'team' | 'intern' = 'team';

  constructor(public apiService: ApiService) {
    this.baseUrl = this.apiService.getBaseUrl();
  }

  ngAfterViewInit(): void {
    new WOW().init();

    $('.owl-carousel').owlCarousel({
      loop: true,
      margin: 10,
      autoplay: true,
      autoplayTimeout: 3000,
      items: 1
    });
    // Fetch sections first
    this.loadSections();
    this.loadTeamMembers('team');
  }

  loadSections(): void {
    this.apiService.getAboutSections().subscribe({
      next: (sections) => {
        this.sections = sections.map(sec => ({
          ...sec,
          showFull: false
        }));
        // For each section, fetch its items
        sections.forEach(sec => {
          this.loadItems(sec.id);
        });
      },
      error: (err) => console.error('Failed to load sections', err)
    });
  }
  toggleSection(section: any): void {
    section.showFull = !section.showFull;
  }
  loadItems(sectionId: string | number): void {
    this.apiService.getAboutItems(Number(sectionId)).subscribe({
      next: (items) => this.itemsMap[sectionId] = items,
      error: (err) => console.error('Failed to load items for section', sectionId, err)
    });
  }
  loadTeamMembers(type: 'team' | 'intern' = 'team') {
    this.activeTab = type;

    if (type === 'team' && this.teamMembers.length) return;
    if (type === 'intern' && this.internMembers.length) return;

    this.apiService.getTeamMembers(type).subscribe({
      next: (res) => {
        if (type === 'team') {
          this.teamMembers = res;
        } else {
          this.internMembers = res;
        }
      },
      error: (err) => console.error(err)
    });
  }
}

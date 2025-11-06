import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-careers-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './careers-details.component.html',
  styleUrls: ['./careers-details.component.scss']
})
export class CareersDetailsComponent implements OnInit {
  Course: any;
  pptUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getCourseById(id).subscribe({
        next: (res: any) => {
          if (Array.isArray(res) && res.length > 0) {
            this.Course = res[0];
          } else if (res?.id) {
            this.Course = res;
          }

          // Generate safe PPT embed URL
          if (this.Course?.file_path) {
            const url = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
              'https://azhalitsolutions.com/api/' + this.Course.file_path
            )}&wdStartOn=1&wdEmbedCode=1`;
            this.pptUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          }
        },
        error: (err) => {
          console.error('Error fetching course details:', err);
        }
      });
    }
  }
}

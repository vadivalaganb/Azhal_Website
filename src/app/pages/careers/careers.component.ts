import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss']
})
export class CareersComponent implements OnInit {
  courses: any[] = [];
  loading = true;
  error = '';
  constructor(private api: ApiService) {

  }
  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses() {
    this.api.getAllCourse().subscribe({
      next: (res) => {
        this.courses = res || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load courses';
        console.error(err);
        this.loading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-blogs-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blogs-details.component.html',
  styleUrls: ['./blogs-details.component.scss']
}) export class BlogDetailsComponent implements OnInit {
  blog: any = null;

  constructor(private route: ActivatedRoute, public api: ApiService) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) this.loadBlog(slug);
  }

  loadBlog(slug: string) {
    this.api.getAllBlogs().subscribe({
      next: (res: any) => {
        this.blog = (res.data || []).find((b: any) => b.slug === slug);
        this.blog.description = this.blog.description.replace(/\n/g, '<br>');

      },
      error: err => console.error(err)
    });
  }
}
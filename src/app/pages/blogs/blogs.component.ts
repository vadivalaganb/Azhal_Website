import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
interface Blog {
  id: number;
  header_name: string;
  short_description: string;
  description: string;
  category_name: string;
  category_slug: string;
  slug: string;
  file_path: string;
  created_at: string;
}

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  categories: FilterOption[] = [];
  selectedFilters: string[] = [];
  searchTerm: string = '';
  isDropdownOpen = false;
  filterButtonText = 'All Categories';

  constructor(public api: ApiService) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs() {
    this.api.getAllBlogs().subscribe({
      next: (res: any) => {
        this.blogs = res.data || [];
        this.filteredBlogs = [...this.blogs];
        this.setFilterOptions();
      },
      error: err => console.error(err)
    });
  }

  setFilterOptions() {
    const categoryMap: { [key: string]: number } = {};
    this.blogs.forEach(blog => {
      const slug = blog.category_slug || this.createSlug(blog.category_name);
      categoryMap[slug] = (categoryMap[slug] || 0) + 1;
    });

    this.categories = Object.keys(categoryMap).map(slug => ({
      value: slug,
      label: this.blogs.find(b => b.category_slug === slug)?.category_name || slug,
      count: categoryMap[slug]
    }));
    this.categories.unshift({ value: 'all', label: 'All', count: this.blogs.length });
  }

  createSlug(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  getFilteredOptions() {
    if (!this.searchTerm) return this.categories;
    return this.categories.filter(opt =>
      opt.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  isFilterSelected(value: string) {
    return this.selectedFilters.includes(value);
  }

  onFilterChange(value: string, event: any) {
    if (value === 'all') {
      this.selectedFilters = [];
    } else if (event.target.checked) {
      this.selectedFilters.push(value);
    } else {
      this.selectedFilters = this.selectedFilters.filter(f => f !== value);
    }
    // this.applyFilters();
  }

  applyFilters() {
    this.filteredBlogs = this.blogs.filter(blog => {
      const slug = blog.category_slug || this.createSlug(blog.category_name);
      if (this.selectedFilters.length === 0) return true;
      return this.selectedFilters.includes(slug);
    });

    this.filterButtonText = this.selectedFilters.length > 0 ?
      `${this.selectedFilters.length} Selected` : 'All Categories';
    this.closeDropdown();
  }

  clearAllFilters() {
    this.selectedFilters = [];
    this.filteredBlogs = [...this.blogs];
    this.searchTerm = '';
    this.filterButtonText = 'All Categories';
  }

  getActiveFilters() {
    return this.categories.filter(cat => this.selectedFilters.includes(cat.value));
  }

  removeFilter(value: string) {
    this.selectedFilters = this.selectedFilters.filter(f => f !== value);
    this.applyFilters();
  }
}
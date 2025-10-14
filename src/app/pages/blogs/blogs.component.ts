import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var $: any;
declare var WOW: any;

interface BlogPost {
  category: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  categorySlug?: string;
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
  @ViewChild('filterDropdown', { static: false }) filterDropdown!: ElementRef;

  blogs: BlogPost[] = [
    {
      category: 'Latest News',
      categorySlug: 'latest-news',
      title: 'Azhal IT Solutions Wins Consulting Excellence Award 2025',
      summary: 'We are thrilled to announce that Azhal IT Solutions has been recognized with the prestigious Consulting Excellence Award 2025.',
      author: 'Sarah Johnson',
      date: 'Oct 5, 2025',
      readTime: '5 min read',
      image: 'assets/image (4).png'
    },
    {
      category: 'Course & Learning',
      categorySlug: 'course-learning',
      title: 'Top 5 Free Courses for Business Analytics',
      summary: 'Explore the latest trends in analytics, AI integration, and data-driven decision-making for business success.',
      author: 'Michael Chen',
      date: 'Oct 3, 2025',
      readTime: '7 min read',
      image: 'assets/image (2).png'
    },
    {
      category: 'Client Success Stories',
      categorySlug: 'client-success',
      title: 'How Azhal Helped a Retail Startup Boost Profits by 60%',
      summary: 'Learn how we partnered with a retail startup to transform their operations and achieve remarkable growth.',
      author: 'Emily Rodriguez',
      date: 'Sep 28, 2025',
      readTime: '6 min read',
      image: 'assets/image (3).png'
    },
    // Add more sample data for better demonstration
    {
      category: 'Technology Insights',
      categorySlug: 'technology-insights',
      title: 'The Future of AI in Business Automation',
      summary: 'Discover how artificial intelligence is revolutionizing business processes and driving efficiency.',
      author: 'David Kumar',
      date: 'Sep 25, 2025',
      readTime: '8 min read',
      image: 'assets/image (3).png'
    },
    {
      category: 'Business Strategy',
      categorySlug: 'business-strategy',
      title: 'Digital Transformation Strategies for SMEs',
      summary: 'Essential strategies for small and medium enterprises to successfully navigate digital transformation.',
      author: 'Lisa Park',
      date: 'Sep 22, 2025',
      readTime: '10 min read',
      image: 'assets/image (4).png'
    }
  ];

  filteredBlogs: BlogPost[] = [];
  selectedFilters: Set<string> = new Set(['all']);
  isDropdownOpen = false;
  searchTerm = '';
  filterButtonText = 'Categories';

  filterOptions: FilterOption[] = [];

  ngOnInit() {
    this.initializeFilters();
    this.filteredBlogs = [...this.blogs];
  }

  initializeFilters() {
    // Count blogs per category
    const categoryCounts: { [key: string]: number } = {};
    
    this.blogs.forEach(blog => {
      const slug = blog.categorySlug || this.createSlug(blog.category);
      categoryCounts[slug] = (categoryCounts[slug] || 0) + 1;
    });

    // Create filter options
    this.filterOptions = [
      { value: 'all', label: 'All Categories', count: this.blogs.length },
      { value: 'latest-news', label: 'Latest News', count: categoryCounts['latest-news'] || 0 },
      { value: 'course-learning', label: 'Course & Learning', count: categoryCounts['course-learning'] || 0 },
      { value: 'client-success', label: 'Client Success Stories', count: categoryCounts['client-success'] || 0 },
      { value: 'technology-insights', label: 'Technology Insights', count: categoryCounts['technology-insights'] || 0 },
      { value: 'business-strategy', label: 'Business Strategy', count: categoryCounts['business-strategy'] || 0 },
      { value: 'financial-legal', label: 'Financial & Legal Advisory', count: categoryCounts['financial-legal'] || 0 },
      { value: 'market-trends', label: 'Market Trends & Research', count: categoryCounts['market-trends'] || 0 },
      { value: 'entrepreneurship', label: 'Entrepreneurship & Leadership', count: categoryCounts['entrepreneurship'] || 0 },
      { value: 'career-culture', label: 'Career & Team Culture', count: categoryCounts['career-culture'] || 0 }
    ];
  }

  createSlug(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    this.searchTerm = '';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.filterDropdown && !this.filterDropdown.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

onFilterChange(filterValue: string, event: Event) {
  const inputElement = event.target as HTMLInputElement | null;
  if (!inputElement) return; // Null check

  const isChecked = inputElement.checked;

  if (filterValue === 'all') {
    if (isChecked) {
      this.selectedFilters.clear();
      this.selectedFilters.add('all');
    }
  } else {
    if (isChecked) {
      this.selectedFilters.delete('all');
      this.selectedFilters.add(filterValue);
    } else {
      this.selectedFilters.delete(filterValue);
      if (this.selectedFilters.size === 0) {
        this.selectedFilters.add('all');
      }
    }
  }
  this.updateFilterButtonText();
  this.filterBlogs();
}


  isFilterSelected(filterValue: string): boolean {
    return this.selectedFilters.has(filterValue);
  }

  clearAllFilters() {
    this.selectedFilters.clear();
    this.selectedFilters.add('all');
    this.applyFilters();
  }

  applyFilters() {
    this.updateFilterButtonText();
    this.filterBlogs();
    this.closeDropdown();
  }

  filterBlogs() {
    if (this.selectedFilters.has('all')) {
      this.filteredBlogs = [...this.blogs];
    } else {
      this.filteredBlogs = this.blogs.filter(blog => {
        const blogSlug = blog.categorySlug || this.createSlug(blog.category);
        return this.selectedFilters.has(blogSlug);
      });
    }
  }

  updateFilterButtonText() {
    if (this.selectedFilters.has('all') || this.selectedFilters.size === 0) {
      this.filterButtonText = 'Categories';
    } else if (this.selectedFilters.size === 1) {
      const selectedFilter = Array.from(this.selectedFilters)[0];
      const option = this.filterOptions.find(opt => opt.value === selectedFilter);
      this.filterButtonText = option ? option.label : 'Categories';
    } else {
      this.filterButtonText = `Categories (${this.selectedFilters.size})`;
    }
  }

  removeFilter(filterValue: string) {
    this.selectedFilters.delete(filterValue);
    if (this.selectedFilters.size === 0) {
      this.selectedFilters.add('all');
    }
    this.applyFilters();
  }

  getActiveFilters(): FilterOption[] {
    if (this.selectedFilters.has('all')) {
      return [];
    }
    return Array.from(this.selectedFilters).map(value => 
      this.filterOptions.find(option => option.value === value)!
    ).filter(Boolean);
  }

  getFilteredOptions(): FilterOption[] {
    if (!this.searchTerm) {
      return this.filterOptions;
    }
    return this.filterOptions.filter(option => 
      option.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}

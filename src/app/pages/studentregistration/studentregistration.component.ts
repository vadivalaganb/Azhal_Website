import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-studentregistration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './studentregistration.component.html',
  styleUrls: ['./studentregistration.component.scss']
})
export class StudentregistrationComponent {
  registrationForm: FormGroup;
  successMsg = '';
  errorMsg = '';
  profileFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  userId: string | null = null; // Store user ID locally

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.registrationForm = this.fb.group({
      institutionName: ['', Validators.required],
      academicYear: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]],
      department: ['', Validators.required],
      course: ['', Validators.required]
    });

    // Get user_id from localStorage on component init
    this.userId = localStorage.getItem('user_id');

    // Optionally preload profile data if userId exists
    if (this.userId) {
      this.loadProfile(this.userId);
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profileFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;  // Data URL string
      };
      reader.readAsDataURL(file);
    }
  }

  loadProfile(userId: string): void {
    const formData = new FormData();
    formData.append('action', 'get_profile');
    formData.append('user_id', userId);

    this.api.postFormData(formData).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.registrationForm.patchValue({
            institutionName: res.data.institution_name || '',
            academicYear: res.data.academic_year || '',
            dob: res.data.dob || '',
            gender: res.data.gender || '',
            address: res.data.address || '',
            department: res.data.department || '',
            course: res.data.course || ''
          });

          if (res.data.profile_image) {
            this.imagePreview = this.api.getBaseUrl() + '/' + res.data.profile_image;
          }
        } else {
          this.errorMsg = res.message || 'Failed to load profile data.';
        }
      },
      error: () => {
        this.errorMsg = 'Server error loading profile data.';
      }
    });
  }

  onSubmit(): void {
    this.successMsg = '';
    this.errorMsg = '';

    if (this.registrationForm.invalid) {
      this.errorMsg = 'Please fill all required fields correctly';
      return;
    }

    if (!this.userId) {
      this.errorMsg = 'User not logged in. Please login first.';
      return;
    }

    const formData = new FormData();
    formData.append('action', 'register_full');
    formData.append('user_id', this.userId);
    Object.keys(this.registrationForm.controls).forEach(key => {
      formData.append(key, this.registrationForm.get(key)?.value);
    });

    if (this.profileFile) {
      formData.append('profileImage', this.profileFile);
    }

    this.api.postFormData(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.successMsg = 'Profile updated successfully!';

          // Optionally navigate or refresh content here
          setTimeout(() => {
            this.successMsg = '';
          }, 1000);
        } else {
          this.errorMsg = res.message || 'Registration failed';
          setTimeout(() => {
            this.errorMsg = '';
          }, 2000);
        }
      },
      error: () => {
        this.errorMsg = 'Server error. Try again later.';
        setTimeout(() => {
          this.errorMsg = '';
        }, 2000);
      }
    });
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }

}

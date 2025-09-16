import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-profile-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-registration.component.html',
  styleUrl: './profile-registration.component.scss'
})
export class ProfileRegistrationComponent {
  profileForm: FormGroup;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.profileForm = this.fb.group({
      institutionName: ['', Validators.required],
      academicYear: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      department: ['', Validators.required],
      course: ['', Validators.required],
      profileImage: [null]
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileForm.patchValue({ profileImage: file });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = new FormData();
      Object.keys(this.profileForm.value).forEach(key => {
        formData.append(key, this.profileForm.value[key]);
      });

      this.api.postProfile(formData).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.successMsg = 'Profile registered successfully!';
            this.errorMsg = '';
            this.profileForm.reset();
          } else {
            this.errorMsg = res.message || 'Profile registration failed';
          }
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMsg = 'Server error. Try again later.';
        }
      });
    }
  }
}

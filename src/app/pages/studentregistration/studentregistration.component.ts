import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  accountForm: FormGroup;
  profileForm: FormGroup;

  accountSuccessMsg = '';
  accountErrorMsg = '';
  profileSuccessMsg = '';
  profileErrorMsg = '';

  profileFile: File | null = null;
  accountCreated: boolean = false;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.accountForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });

    this.profileForm = this.fb.group({
      institutionName: ['', Validators.required],
      academicYear: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      department: ['', Validators.required],
      course: ['', Validators.required]
    });
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id) {
      this.loadProfile(user.id);
      this.accountCreated = true;
      // Enable Step 2 tab
      const step2TabEl = document.getElementById('step2-tab');
      if (step2TabEl) {
        step2TabEl.classList.remove('disabled');
      }
    } else {
      // Not logged in, show registration
      this.accountCreated = false;
      const step2TabEl = document.getElementById('step2-tab');
      if (step2TabEl) {
        step2TabEl.classList.add('disabled');
      }
    }
  }

  passwordMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) this.profileFile = file;
  }

  loadProfile(userId: number) {
    const formData = new FormData();
    formData.append('action', 'get_profile');
    formData.append('user_id', userId.toString());

    this.api.postFormData(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          const data = res.data;
          // Patch account form
          this.accountForm.patchValue({
            fullName: data.full_name,
            email: data.email,
            password: '',
            confirmPassword: ''
          });
          // Patch profile form
          this.profileForm.patchValue({
            institutionName: data.institutionName,
            academicYear: data.academic_year,
            dob: data.dob,
            gender: data.gender,
            address: data.address,
            mobile: data.mobile,
            department: data.department,
            course: data.course
          });

          // Disable fields except fullName, mobile, profileImage
          this.accountForm.get('fullName')?.enable();
          this.accountForm.get('email')?.disable();
          this.accountForm.get('password')?.disable();
          this.accountForm.get('confirmPassword')?.disable();
          this.profileForm.get('mobile')?.enable();
          this.profileForm.get('institutionName')?.disable();
          this.profileForm.get('academicYear')?.disable();
          this.profileForm.get('dob')?.disable();
          this.profileForm.get('gender')?.disable();
          this.profileForm.get('address')?.disable();
          this.profileForm.get('department')?.disable();
          this.profileForm.get('course')?.disable();
        }
      },
      error: (err) => console.error('Load Profile Error:', err)
    });
  }

  onAccountSubmit() {
    this.accountSuccessMsg = '';
    this.accountErrorMsg = '';
    if (this.accountForm.invalid) {
      this.accountErrorMsg = 'Please fill all required fields correctly';
      return;
    }
    const payload = {
      action: 'register',
      full_name: this.accountForm.value.fullName,
      email: this.accountForm.value.email,
      password: this.accountForm.value.password
    };
    this.api.postAccount(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.accountSuccessMsg = 'Account created successfully!';
          setTimeout(() => this.accountSuccessMsg = '', 2000);
          this.accountErrorMsg = '';
          this.accountCreated = true;
          // Switch to Step 2 tab
          const step2TabEl = document.getElementById('step2-tab');
          if (step2TabEl) {
            const tab = new (window as any).bootstrap.Tab(step2TabEl);
            tab.show();
            step2TabEl.classList.remove('disabled');
          }
          // Save user info
          localStorage.setItem('user', JSON.stringify({
            id: res.user_id,
            email: payload.email,
            fullName: payload.full_name
          }));
        } else {
          this.accountErrorMsg = res.message || 'Account creation failed';
        }
      },
      error: (err) => {
        console.error('Account Error:', err);
        this.accountErrorMsg = 'Server error. Try again later.';
        setTimeout(() => this.accountErrorMsg = '', 2000);
      }
    });
  }

  onProfileSubmit() {
    this.profileSuccessMsg = '';
    this.profileErrorMsg = '';

    if (!this.accountCreated) {
      this.profileErrorMsg = 'Complete Step 1 first!';
      return;
    }
    if (this.profileForm.invalid) {
      this.profileErrorMsg = 'Please fill all required fields correctly';
      return;
    }

    const formData = new FormData();
    formData.append('action', 'profile');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) {
      this.profileErrorMsg = 'User ID not found. Please login again.';
      return;
    }
    formData.append('user_id', user.id);

    // Append all profile form fields
    Object.keys(this.profileForm.controls).forEach(key => {
      const value = this.profileForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Append full_name from account form for username
    formData.append('full_name', this.accountForm.get('fullName')?.value);

    // Append profile image if selected
    if (this.profileFile) {
      formData.append('profileImage', this.profileFile);
    }

    this.api.postFormData(formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.profileSuccessMsg = 'Profile updated successfully!';
          setTimeout(() => this.profileSuccessMsg = '', 2000);
          this.profileErrorMsg = '';
          // Reload profile to refresh form data if needed
          this.loadProfile(user.id);
        } else {
          this.profileErrorMsg = res.message || 'Profile update failed';
        }
      },
      error: (err) => {
        console.error('Profile Error:', err);
        this.profileErrorMsg = 'Server error. Try again later.';
        setTimeout(() => this.profileErrorMsg = '', 2000);
      }
    });
  }


  logout() {
    localStorage.removeItem('user');
    location.reload(); // reload to reset state
  }
}

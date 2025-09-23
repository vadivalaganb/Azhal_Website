import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      contact: ['', [Validators.required, this.emailOrMobileValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  // ✅ Validator: Accepts either email OR 10-digit mobile
  emailOrMobileValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const value = control.value.trim();

    const mobilePattern = /^[0-9]{10}$/; // adjust for country code if needed
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return mobilePattern.test(value) || emailPattern.test(value)
      ? null
      : { emailOrMobile: true };
  }

  passwordMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    this.successMsg = '';
    this.errorMsg = '';

    if (this.signupForm.invalid) {
      this.errorMsg = 'Please fill all required fields correctly';
      return;
    }

    const payload = {
      action: 'register',
      first_name: this.signupForm.value.firstName,
      last_name: this.signupForm.value.lastName,
      contact: this.signupForm.value.contact,
      password: this.signupForm.value.password
    };

    this.api.postAccount(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.successMsg = 'Signup successful! Please login.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.errorMsg = res.message || 'Signup failed';
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
}

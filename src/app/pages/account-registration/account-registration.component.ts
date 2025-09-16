import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/services/api.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-account-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account-registration.component.html',
  styleUrl: './account-registration.component.scss'
})
export class AccountRegistrationComponent {
  accountForm: FormGroup;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.accountForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.api.postAccount(this.accountForm.value).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.successMsg = 'Account created successfully. Redirecting...';
            this.errorMsg = '';

            setTimeout(() => {
              this.router.navigate(['/app-profile-registration']);
            }, 2000);
          } else {
            this.errorMsg = res.message || 'Account creation failed';
            this.successMsg = '';
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

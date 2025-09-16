import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  successMsg: string = '';
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    // ✅ Create form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // ✅ On login submit
  onLogin() {
    if (this.loginForm.valid) {
      this.api.postLogin(this.loginForm.value).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.successMsg = 'Login successful! Redirecting...';
            this.errorMsg = '';

            // Store token / session if backend provides
            localStorage.setItem('token', res.token);

            // Redirect to profile page
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 1500);
          } else {
            this.errorMsg = res.message || 'Invalid email or password';
            this.successMsg = '';
          }
        },
        error: (err) => {
          console.error('Login Error:', err);
          this.errorMsg = 'Server error. Try again later.';
          this.successMsg = '';
        }
      });
    } else {
      this.errorMsg = 'Please enter valid credentials';
    }
  }
}

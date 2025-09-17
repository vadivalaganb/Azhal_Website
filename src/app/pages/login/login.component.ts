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
      // Add the action property to login payload
      const payload = {
        ...this.loginForm.value,
        action: 'login'
      };

      this.api.postLogin(payload).subscribe({
        next: (res: any) => {
          if (res.success) {
            localStorage.setItem("token", res.token);
            localStorage.setItem("user", JSON.stringify(res.user));
            this.router.navigate(['/student_registration']);
            this.successMsg = 'Login successful!';
          } else {
            this.errorMsg = res.message || 'Invalid email or password';
          }
        },
        error: (err) => {
          console.error('Login Error:', err);
          this.errorMsg = 'Server error. Try again later.';
        }
      });
    }
  }

}

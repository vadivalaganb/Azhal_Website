import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  contactForm: FormGroup;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);

      this.api.postContact(this.contactForm.value).subscribe({
        next: (res: any) => {
          console.log('Response:', res);

          if (res.success) {
            this.successMsg = res.message || 'Message sent successfully';
            this.errorMsg = '';
            this.contactForm.reset();
          } else {
            this.errorMsg = res.message || 'Failed to send message';
            this.successMsg = '';
          }
        },
        error: (err) => {
          console.error('HTTP Error:', err);
          this.errorMsg = 'Server error. Try again later.';
          this.successMsg = '';
        }
      });
    }
  }


}

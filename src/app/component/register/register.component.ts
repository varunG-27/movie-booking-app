import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  signUpRequest = {
    loginId: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: 0,
    roles: ['user'],
    password: ''
  };
  confirmPassword = '';
  loading = false;
  submitted = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.submitted = true;

    if (!this.signUpRequest.loginId || !this.signUpRequest.firstName || !this.signUpRequest.lastName || !this.signUpRequest.email || !this.signUpRequest.contactNumber || !this.signUpRequest.password || this.signUpRequest.password !== this.confirmPassword) {
      return;
    }

    this.loading = true;
    this.authService.register(this.signUpRequest).subscribe(
      response => {
        console.log('Registration successful', response);
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Registration failed', error);
        this.errorMessage = error.error.message || 'An error occurred during registration.';
        this.loading = false;
      }
    );
  }
}

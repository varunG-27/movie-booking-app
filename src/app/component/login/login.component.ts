import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginRequest = {
    loginId: '',
    password: ''
  };
  rememberMe = false;
  loading = false;
  submitted = false;

  constructor(private authService: AuthService, private router: Router) {}
forget():void{
  this.router.navigate(['/forgetpassword']);
}
  onSubmit(): void {
    this.submitted = true;

    if (!this.loginRequest.loginId || !this.loginRequest.password) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginRequest).subscribe(
      response => {
        console.log('Login successful', response);
        this.loading = false;

        // Store JWT and user info
        localStorage.setItem('token', response.accessToken);
        this.router.navigate(['/home']);
        if (this.rememberMe) {
          localStorage.setItem('user', JSON.stringify(response));
        }

        // Navigate to home page or dashboard
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Login failed', error);
        alert("Login failed");
        this.loading = false;
      }
    );
  }
}

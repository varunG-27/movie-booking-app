import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      loginId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const loginId = this.forgotPasswordForm.value.loginId;
      const password = this.forgotPasswordForm.value.password;
      this.authService.resetPassword(loginId, password).subscribe(
        response => {
          console.log('Password reset successful', response);
          alert('Password reset successful');
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error resetting password', error);
          alert('Error resetting password');
        }
      );
    }
  }
}
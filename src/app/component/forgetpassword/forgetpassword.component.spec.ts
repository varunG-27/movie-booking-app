import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ForgetpasswordComponent } from './forgetpassword.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ForgetpasswordComponent', () => {
  let component: ForgetpasswordComponent;
  let fixture: ComponentFixture<ForgetpasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);
    
    TestBed.configureTestingModule({
      declarations: [ ForgetpasswordComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } }
      ]
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.resetPassword and navigate to login page on successful password reset', () => {
    const loginId = 'test';
    const password = 'newpassword';
    component.forgotPasswordForm.setValue({ loginId, password });
    authService.resetPassword.and.returnValue(of({}));
    spyOn(window, 'alert');

    component.onSubmit();

    expect(authService.resetPassword).toHaveBeenCalledWith(loginId, password);
    expect(window.alert).toHaveBeenCalledWith('Password reset successful');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle password reset failure', () => {
    component.forgotPasswordForm.setValue({ loginId: 'test', password: 'newpassword' });
    const errorResponse = { message: 'Error resetting password' };
    authService.resetPassword.and.returnValue(throwError(errorResponse));
    spyOn(window, 'alert');

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Error resetting password');
  });

  it('should not call authService.resetPassword if form is invalid', () => {
    // Reset the spy before spying again
    authService.resetPassword.calls.reset();
    
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    submitButton.triggerEventHandler('click', null);
  
    expect(authService.resetPassword).not.toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from 'src/app/service/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    
    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [ FormsModule ],
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
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call authService.register if form is invalid', () => {
    // Reset the spy before spying again
    authService.register.calls.reset();
    
    component.onSubmit();
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should call authService.register if form is valid', () => {
    const mockResponse = { message: 'Registration successful' };
    component.signUpRequest = {
      loginId: 'test',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      contactNumber: 1234567890,
      roles: ['user'],
      password: 'password'
    };
    component.confirmPassword = 'password';
    authService.register.and.returnValue(of(mockResponse));
  
    component.onSubmit();
  
    expect(authService.register).toHaveBeenCalledWith(component.signUpRequest);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle registration failure', () => {
    const errorResponse = { error: { message: 'Registration failed' } };
    component.signUpRequest = {
      loginId: 'test',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      contactNumber: 1234567890,
      roles: ['user'],
      password: 'password'
    };
    component.confirmPassword = 'password';
    authService.register.and.returnValue(throwError(errorResponse));
    spyOn(console, 'error');

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Registration failed', errorResponse);
    expect(component.errorMessage).toEqual(errorResponse.error.message);
  });
});

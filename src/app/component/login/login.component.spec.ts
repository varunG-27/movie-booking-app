import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/service/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login and navigate to home page on successful login', () => {
    const mockResponse = { accessToken: 'mockToken' };
    component.loginRequest = {
      loginId: 'test',
      password: 'password'
    };
    authService.login.and.returnValue(of(mockResponse));
    spyOn(localStorage, 'setItem');
    spyOn(router, 'navigate');

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(component.loginRequest);
    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.accessToken);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle login failure', () => {
    const errorResponse = { error: { message: 'Login failed' } };
    component.loginRequest = {
      loginId: 'test',
      password: 'password'
    };
    authService.login.and.returnValue(throwError(errorResponse));
    spyOn(console, 'error');
    spyOn(window, 'alert');
    
    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Login failed', errorResponse);
    expect(window.alert).toHaveBeenCalledWith('Login failed');
  });

  it('should navigate to forgetpassword route', () => {
    spyOn(router, 'navigate');
    component.forget();
    expect(router.navigate).toHaveBeenCalledWith(['/forgetpassword']);
  });
});

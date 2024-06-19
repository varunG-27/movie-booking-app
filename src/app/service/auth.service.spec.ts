import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear(); // Clear localStorage after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a login request', () => {
    const credentials = { loginId: 'test', password: 'password' };
    const dummyResponse = { token: '12345' };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(dummyResponse);
  });

  it('should send a registration request', () => {
    const signUpRequest = {
      loginId: 'testUser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      contactNumber: 1234567890,
      roles: ['ROLE_USER'],
      password: 'password'
    };
    const dummyResponse = { message: 'User registered successfully' };

    service.register(signUpRequest).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(signUpRequest);
    req.flush(dummyResponse);
  });

  it('should send a password reset request', () => {
    const loginId = 'testUser';
    const password = 'newPassword';
    const dummyResponse = { message: 'Password reset successfully' };

    service.resetPassword(loginId, password).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${loginId}/forgot`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ loginId, password });
    req.flush(dummyResponse);
  });

  it('should check if user is logged in', () => {
    expect(service.isLoggedIn()).toBeFalse();
    localStorage.setItem('token', '12345');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should logout the user', () => {
    spyOn(router, 'navigate');
    localStorage.setItem('token', '12345');
    localStorage.setItem('user', JSON.stringify({ username: 'testUser' }));
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return user roles', () => {
    const roles = ['ROLE_USER', 'ROLE_ADMIN'];
    localStorage.setItem('user', JSON.stringify({ roles }));
    expect(service.getUserRoles()).toEqual(roles);
  });

  it('should check if user is admin', () => {
    localStorage.setItem('user', JSON.stringify({ roles: ['ROLE_USER'] }));
    expect(service.isAdmin()).toBeFalse();
    localStorage.setItem('user', JSON.stringify({ roles: ['ROLE_ADMIN'] }));
    expect(service.isAdmin()).toBeTrue();
  });
});

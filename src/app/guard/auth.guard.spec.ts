import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../service/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'isAdmin']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if user is logged in and route does not require admin role', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    authService.isLoggedIn.and.returnValue(true);
    authService.isAdmin.and.returnValue(false);

    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('should return true if user is logged in and route requires admin role and user is admin', () => {
    const route = { data: { role: 'admin' } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    authService.isLoggedIn.and.returnValue(true);
    authService.isAdmin.and.returnValue(true);

    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('should navigate to login page and return false if user is logged in but route requires admin role and user is not admin', () => {
    const route = { data: { role: 'admin' } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    authService.isLoggedIn.and.returnValue(true);
    authService.isAdmin.and.returnValue(false);
    spyOn(router, 'navigate');

    expect(guard.canActivate(route, state)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to login page and return false if user is not logged in', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    authService.isLoggedIn.and.returnValue(false);
    spyOn(router, 'navigate');
  
    expect(guard.canActivate(route, state)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});

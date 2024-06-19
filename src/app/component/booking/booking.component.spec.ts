import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BookingComponent } from './booking.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { MovieService } from 'src/app/service/movie.service';
import { of, throwError } from 'rxjs';

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let movieService: jasmine.SpyObj<MovieService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const movieServiceSpy = jasmine.createSpyObj('MovieService', ['bookTickets']);

    TestBed.configureTestingModule({
      declarations: [ BookingComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'Mock Movie' } } } },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } }
      ]
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call movieService.bookTickets and navigate to home page on successful ticket booking', () => {
    const seatNumbers = 'A1, A2, A3';
    component.seatNumbers = seatNumbers;
    movieService.bookTickets.and.returnValue(of({}));

    component.onSubmit();

    expect(movieService.bookTickets).toHaveBeenCalledWith('Mock Movie', {
      loginId: '',
      movieName: 'Mock Movie',
      theatreName: '',
      noOfTickets: 0,
      seatNumber: ['A1', 'A2', 'A3']
    });
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle ticket booking failure', () => {
    movieService.bookTickets.and.returnValue(throwError('Booking failed'));

    component.onSubmit();

    expect(router.navigate).not.toHaveBeenCalled();
    // Add your additional expectations if needed
  });
});

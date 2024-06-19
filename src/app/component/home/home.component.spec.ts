import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { AuthService } from 'src/app/service/auth.service';
import { MovieService } from 'src/app/service/movie.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: AuthService;
  let movieService: MovieService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [HomeComponent],
      providers: [AuthService, MovieService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    movieService = TestBed.inject(MovieService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movies on init', () => {
    const dummyMovies = [
      { movieName: 'Movie 1', theatreName: 'Theatre 1', noOfTicketsAvailable: 10, ticketStatus: 'Available' },
      { movieName: 'Movie 2', theatreName: 'Theatre 2', noOfTicketsAvailable: 5, ticketStatus: 'Sold Out' }
    ];

    spyOn(movieService, 'getAllMovies').and.returnValue(of(dummyMovies));

    component.ngOnInit();

    expect(component.movies).toEqual(dummyMovies);
    expect(component.filteredMovies).toEqual(dummyMovies);
  });

  it('should handle error on loadMovies', () => {
    spyOn(movieService, 'getAllMovies').and.returnValue(throwError('Error fetching movies'));
    spyOn(console, 'error');

    component.loadMovies();

    expect(console.error).toHaveBeenCalledWith('Error fetching movies', 'Error fetching movies');
  });

  it('should filter movies based on search query', () => {
    component.movies = [
      { movieName: 'Movie 1', theatreName: 'Theatre 1', noOfTicketsAvailable: 10, ticketStatus: 'Available' },
      { movieName: 'Movie 2', theatreName: 'Theatre 2', noOfTicketsAvailable: 5, ticketStatus: 'Sold Out' }
    ];

    component.searchQuery = 'movie 1';
    component.filterMovies();

    expect(component.filteredMovies).toEqual([{ movieName: 'Movie 1', theatreName: 'Theatre 1', noOfTicketsAvailable: 10, ticketStatus: 'Available' }]);

    component.searchQuery = '';
    component.filterMovies();

    expect(component.filteredMovies).toEqual(component.movies);
  });

  it('should navigate to booking page when bookMovie is called', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.bookMovie('Movie 1');

    expect(navigateSpy).toHaveBeenCalledWith(['/booking', 'Movie 1']);
  });

  it('should call authService.logout when logout is called', () => {
    spyOn(authService, 'logout');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
  });
});

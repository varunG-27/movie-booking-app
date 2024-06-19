import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { HttpClientModule } from '@angular/common/http';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all movies', () => {
    const dummyMovies = [
      { movieName: 'Movie 1', theatreName: 'Theatre 1', noOfTicketsAvailable: 10, ticketStatus: 'Available' },
      { movieName: 'Movie 2', theatreName: 'Theatre 2', noOfTicketsAvailable: 5, ticketStatus: 'Sold Out' }
    ];

    service.getAllMovies().subscribe(movies => {
      expect(movies.length).toBe(2);
      expect(movies).toEqual(dummyMovies);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/all`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMovies);
  });

  it('should book tickets for a movie', () => {
    const ticket = { userId: 1, seats: 2 };
    const movieName = 'Movie 1';

    service.bookTickets(movieName, ticket).subscribe(response => {
      expect(response).toEqual(ticket);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/${movieName}/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(ticket);
    req.flush(ticket);
  });

  it('should handle error while deleting a movie', () => {
    const movieName = 'Movie 1';
    const errorResponse = { message: 'Internal Server Error' };

    service.deleteMovie(movieName).subscribe(
      () => fail('expected an error, not movie deletion'),
      error => {
        expect(error.error).toEqual(errorResponse);
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/${movieName}/delete`);
    expect(req.request.method).toBe('DELETE');

    
    req.flush(errorResponse, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should retrieve all booked tickets for a movie', () => {
    const dummyTickets = [
      { userId: 1, seats: 2 },
      { userId: 2, seats: 3 }
    ];
    const movieName = 'Movie 1';

    service.getAllBookedTickets(movieName).subscribe(tickets => {
      expect(tickets.length).toBe(2);
      expect(tickets).toEqual(dummyTickets);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/getallbookedtickets/${movieName}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTickets);
  });

  it('should handle error while updating ticket status', () => {
    const movieName = 'Movie 1';
    const errorResponse = { message: 'Internal Server Error' };

    service.updateTicketStatus(movieName).subscribe(
      () => fail('expected an error, not ticket status update'),
      error => {
        expect(error.error).toEqual(errorResponse);
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/admin/${movieName}/update`);
    expect(req.request.method).toBe('PUT');

    
    req.flush(errorResponse, { status: 500, statusText: 'Internal Server Error' });
  });
});

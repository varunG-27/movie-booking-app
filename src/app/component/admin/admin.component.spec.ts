import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { AuthService } from 'src/app/service/auth.service';
import { MovieService } from 'src/app/service/movie.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockMovieService: jasmine.SpyObj<MovieService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    mockMovieService = jasmine.createSpyObj('MovieService', ['getAllBookedTickets', 'deleteMovie', 'updateTicketStatus']);

    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: MovieService, useValue: mockMovieService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#fetchBookedTickets', () => {
    it('should alert if movieName is empty', () => {
      spyOn(window, 'alert');
      component.movieName = '';
      component.fetchBookedTickets();
      expect(window.alert).toHaveBeenCalledWith('Please enter a movie name');
    });

    it('should fetch tickets if movieName is provided', () => {
      const ticketsMock = [{ loginId: 'testUser', movieName: 'testMovie', theatreName: 'testTheatre', noOfTickets: 2, seatNumber: ['A1', 'A2'] }];
      mockMovieService.getAllBookedTickets.and.returnValue(of(ticketsMock));
      component.movieName = 'testMovie';
      component.fetchBookedTickets();
      expect(component.tickets).toEqual(ticketsMock);
    });

    it('should alert unauthorized on error', () => {
      spyOn(window, 'alert');
      mockMovieService.getAllBookedTickets.and.returnValue(throwError({ status: 401 }));
      component.movieName = 'testMovie';
      component.fetchBookedTickets();
      expect(window.alert).toHaveBeenCalledWith('Unthorized');
    });
  });

  describe('#deleteMovie', () => {
    it('should delete the movie and alert success', () => {
      const deleteResponseMock = [{ success: true }];
      spyOn(window, 'alert');
      mockMovieService.deleteMovie.and.returnValue(of(deleteResponseMock));
      component.movieName = 'testMovie';
      component.deleteMovie();
      expect(window.alert).toHaveBeenCalledWith('Deleted Sucessfully');
    });

    it('should log an error if delete fails', () => {
      spyOn(console, 'error');
      mockMovieService.deleteMovie.and.returnValue(throwError({ status: 500 }));
      component.movieName = 'testMovie';
      component.deleteMovie();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('#updateTicketStatus', () => {
    it('should update ticket status and alert success', () => {
      const updateResponseMock = 'Updated';
      spyOn(window, 'alert');
      mockMovieService.updateTicketStatus.and.returnValue(of(updateResponseMock));
      component.movieName = 'testMovie';
      component.updateTicketStatus();
      expect(window.alert).toHaveBeenCalledWith('Updated Sucessfully');
    });

    it('should log an error if update fails', () => {
      spyOn(console, 'error');
      mockMovieService.updateTicketStatus.and.returnValue(throwError({ status: 500 }));
      component.movieName = 'testMovie';
      component.updateTicketStatus();
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('should call authService.logout on logout', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});

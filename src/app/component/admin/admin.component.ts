import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { MovieService } from 'src/app/service/movie.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  movieName: string = '';
  tickets: any[] = [];
  message!: string;

  selectedTab: string = 'view-tickets';
  constructor(private adminService: MovieService, private authService: AuthService) { }

  fetchBookedTickets(): void {
    if (!this.movieName) {
      alert('Please enter a movie name');
      return;
    }


    this.adminService.getAllBookedTickets(this.movieName).subscribe(
      (data) => {
        this.tickets = data;
      },
      (error) => {
        alert('Unthorized');
      }
    );
  }
  logout(): void {
    this.authService.logout();
  }
  deleteMovie() {
    this.adminService.deleteMovie(this.movieName).subscribe(
      (data) => {
        this.tickets = data;
        alert("Deleted Sucessfully");
      },
      error => {
        console.error('Error updating ticket status', error);
      }
    );

  }
  updateTicketStatus(): void {
    this.adminService.updateTicketStatus(this.movieName).subscribe(
      response => {

        this.message = response;
        alert("Updated Sucessfully");
      },
      error => {
        console.error('Error updating ticket status', error);
      }
    );
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { MovieService } from 'src/app/service/movie.service';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  loginId: string = ''; // Add loginId property
  movieName: string = '';
  ticket = {
    loginId: '', // Initialize with empty string
    movieName: '',
    theatreName: '',
    noOfTickets: 0,
    seatNumber: [] as string[] // Explicitly define the type as string[]
  };
  seatNumbers: string = '';

  constructor(private route: ActivatedRoute,private authService: AuthService, private movieService: MovieService, private router: Router) {
    this.loginId = localStorage.getItem('userName') || ''; // Initialize loginId from local storage
  }

  ngOnInit(): void {
    this.movieName = this.route.snapshot.paramMap.get('movieName')!;
    this.ticket.movieName = this.movieName;
    this.ticket.loginId = this.loginId; // Assign loginId to ticket
  }

  logout(): void {
    this.authService.logout();
  }
  onSubmit(): void {
    this.ticket.seatNumber = this.seatNumbers.split(',').map(seat => seat.trim());
    this.movieService.bookTickets(this.movieName, this.ticket).subscribe(response => {
      alert('Ticket Booked Successfully');
      this.router.navigate(['/home']);
    }, error => {
      console.error('booking failed', error);
    });
  }
}

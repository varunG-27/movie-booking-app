import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { MovieService } from 'src/app/service/movie.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  movies: any[] = [];
  filteredMovies: any[] = [];
  searchQuery: string = '';

  constructor(private authService: AuthService, private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.loadMovies();
    this.getMovies();
  }

  getMovies(): void {
    this.movieService.getAllMovies().subscribe(
      movies => {
        this.movies = movies;
      },
      error => {
        console.error('Failed to fetch movies', error);
      }
    );
  }

  bookMovie(movieName: string) {
    this.router.navigate(['/booking', movieName]);
  }
  loadMovies(): void {
    this.movieService.getAllMovies().subscribe(
      data => {
        this.movies = data;
        this.filteredMovies = data;
      },
      error => {
        console.error('Error fetching movies', error);
      }
    );
  }

  filterMovies(): void {
    if (this.searchQuery) {
      this.filteredMovies = this.movies.filter(movie =>
        movie.movieName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredMovies = this.movies;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}

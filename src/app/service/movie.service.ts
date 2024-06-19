import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:8080/api/v1.0/moviebooking';

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
 
  bookTickets(movieName: string, ticket: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${movieName}/add`, ticket);
  }
deleteMovie(movieName: string): Observable<any[]> {
  return this.http.delete<any[]>(`${this.apiUrl}/${movieName}/delete`, { headers: this.getAuthHeaders() });
}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllBookedTickets(movieName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getallbookedtickets/${movieName}`, { headers: this.getAuthHeaders() });
  }

  updateTicketStatus(movieName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/${movieName}/update`, {}, { headers: this.getAuthHeaders() });
  }
}

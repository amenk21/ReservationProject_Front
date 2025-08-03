import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Reservation {
  id?: string;
  salleId: string;
  utilisateurId: string;
  dateDebut: string;
  dateFin: string;
  motif?: string;
  statut: 'EnAttente' | 'Validée' | 'Refusée';  
  isDeleted?: boolean;
}

export interface ChangeStatusCommand {
  reservationId: string;
  nouveauStatut: 'EnAttente' | 'Validée' | 'Refusée';
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'https://localhost:7171/api/Reservations';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error(
      error.error instanceof ErrorEvent
        ? `Client-side error: ${error.error.message}`
        : `Server error: ${error.status}, Body: ${JSON.stringify(error.error)}`
    );
    return throwError(() => error);
  }

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  create(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  update(id: string, updated: Partial<Reservation>): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, updated, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  changeStatut(command: ChangeStatusCommand): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/changer-statut`, command, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}

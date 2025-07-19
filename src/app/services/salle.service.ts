import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export enum StatutSalle {
  Disponible = 'Disponible',
  Reservée = 'Réservée',
  EnMaintenance = 'EnMaintenance'
}

export interface Salle {
  id?: string;
  nom: string;
  capacite: number;
  statut?: StatutSalle;
  filialeId: string;
}

@Injectable({ providedIn: 'root' })
export class SalleService {
  private apiUrl = 'https://localhost:7171/api/Salle';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);
    return throwError(() => error);
  }

  getAll(): Observable<Salle[]> {
    return this.http.get<Salle[]>(this.apiUrl, this.httpOptions).pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<Salle> {
    return this.http.get<Salle>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  add(salle: Salle): Observable<Salle> {
    return this.http.post<Salle>(this.apiUrl, salle, this.httpOptions).pipe(catchError(this.handleError));
  }

  update(id: string, salle: Partial<Salle>): Observable<Salle> {
    return this.http.put<Salle>(`${this.apiUrl}/${id}`, salle, this.httpOptions).pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }
}
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Filiale {
  id?: string;
  nom: string;
  adresse?: string;
  telephone?: string;
}

@Injectable({ providedIn: 'root' })
export class FilialeService {
  private apiUrl = 'https://localhost:7171/api/Filiale';
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

  getAll(): Observable<Filiale[]> {
    return this.http.get<Filiale[]>(this.apiUrl, this.httpOptions).pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<Filiale> {
    return this.http.get<Filiale>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }

  add(filiale: Filiale): Observable<Filiale> {
    return this.http.post<Filiale>(this.apiUrl, filiale, this.httpOptions).pipe(catchError(this.handleError));
  }

  update(id: string, filiale: Partial<Filiale>): Observable<Filiale> {
    return this.http.put<Filiale>(`${this.apiUrl}/${id}`, filiale, this.httpOptions).pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }
}

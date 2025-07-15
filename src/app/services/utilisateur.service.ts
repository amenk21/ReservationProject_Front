import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Utilisateur {
  id?: string;
  nom: string;
  email: string;
  motDePasse?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'https://localhost:7171/api/Utilisateur';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error occurred:', error.error.message);
    } else {
      // Server-side error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  login(email: string, motDePasse: string): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(
      `${this.apiUrl}/login`,
      { email, motDePasse },
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  register(user: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(
      this.apiUrl,
      user,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(
      this.apiUrl,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(
      `${this.apiUrl}/${id}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, user: Partial<Utilisateur>): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(
      `${this.apiUrl}/${id}`,
      user,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }


}
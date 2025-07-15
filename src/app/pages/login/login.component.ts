import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilisateurService, Utilisateur } from 'src/app/services/utilisateur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  email: string = '';
  motDePasse: string = '';
  errorMessage: string = '';

  constructor(
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  login(): void {
    this.utilisateurService.login(this.email, this.motDePasse).subscribe({
      next: (user: Utilisateur) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/dashboard']); // redirect after login
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    });
  }
}

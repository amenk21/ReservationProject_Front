import { Component, OnInit } from '@angular/core';
import { UtilisateurService, Utilisateur } from 'src/app/services/utilisateur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  nom: string = '';
  email: string = '';
  motDePasse: string = '';
  confirmMotDePasse: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private utilisateurService: UtilisateurService,
    private router: Router
  ) { }

  ngOnInit(): void {}

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    if (!nameRegex.test(this.nom)) {
      this.errorMessage = 'Le nom ne doit contenir que des lettres.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Veuillez entrer une adresse email valide.';
      return;
    }

    if (this.motDePasse !== this.confirmMotDePasse) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    const newUser: Utilisateur = {
      nom: this.nom.trim(),
      email: this.email.trim(),
      motDePasse: this.motDePasse,
      role: 'Formateur'
    };

    this.utilisateurService.register(newUser).subscribe({
      next: (createdUser) => {
        console.log('✅ Utilisateur créé :', createdUser);
        this.successMessage = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.error('❌ Erreur lors de l\'inscription :', err);

        if (err.status === 409) {
          this.errorMessage = 'Cet email existe déjà.';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la création du compte.';
        }
      }
    });
  }
}

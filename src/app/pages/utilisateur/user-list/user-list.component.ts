import { Component, OnInit } from '@angular/core';
import { UtilisateurService, Utilisateur } from 'src/app/services/utilisateur.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  utilisateurs: Utilisateur[] = [];
  utilisateursAffiches: Utilisateur[] = [];
  loading = true;
  error: string | null = null;

  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  currentUser: Utilisateur | null = null;

  constructor(
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.utilisateurService.getCurrentUser();
    this.fetchUtilisateurs();
  }

  fetchUtilisateurs() {
    this.utilisateurService.getAll().subscribe({
      next: (data) => {
        this.utilisateurs = data;
        this.totalPages = Math.ceil(this.utilisateurs.length / this.pageSize);
        this.setPage(this.currentPage);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des utilisateurs.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.utilisateursAffiches = this.utilisateurs.slice(start, end);
  }

  addUtilisateur() {
    Swal.fire({
      title: 'Ajouter un utilisateur',
      html:
        `<input id="nom" class="swal2-input" placeholder="Nom">` +
        `<input id="email" class="swal2-input" placeholder="Email">` +
        `<input id="motDePasse" type="password" class="swal2-input" placeholder="Mot de passe">` +
        `<select id="role" class="swal2-input">
          <option value="Admin">Admin</option>
          <option value="Formateur">Formateur</option>
        </select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      preConfirm: () => {
        const nom = (document.getElementById('nom') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const motDePasse = (document.getElementById('motDePasse') as HTMLInputElement).value;
        const role = (document.getElementById('role') as HTMLSelectElement).value;

        if (!nom || !email || !motDePasse || !role) {
          Swal.showValidationMessage('Tous les champs sont requis');
          return;
        }

        return { nom, email, motDePasse, role };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.utilisateurService.register(result.value).subscribe({
          next: () => {
            Swal.fire('Succès', 'Utilisateur ajouté', 'success');
            this.fetchUtilisateurs();
          },
          error: () => Swal.fire('Erreur', 'Impossible d\'ajouter l\'utilisateur', 'error')
        });
      }
    });
  }

  deleteUtilisateur(id: string) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.utilisateurService.delete(id).subscribe({
          next: () => {
            const isCurrentUser = this.currentUser?.id === id;
            if (isCurrentUser) {
              Swal.fire({
                icon: 'success',
                title: 'Compte supprimé',
                text: 'Votre compte a été supprimé. Vous allez être déconnecté.',
                confirmButtonText: 'OK'
              }).then(() => {
                localStorage.removeItem('currentUser');
                this.router.navigate(['/login']);
              });
            } else {
              Swal.fire('Supprimé', 'Utilisateur supprimé', 'success');
              this.fetchUtilisateurs();
            }
          },
          error: () => Swal.fire('Erreur', 'Impossible de supprimer', 'error')
        });
      }
    });
  }

  editUtilisateur(user: Utilisateur) {
    Swal.fire({
      title: 'Modifier utilisateur',
      html:
        `<input id="nom" class="swal2-input" value="${user.nom}">` +
        `<input id="email" class="swal2-input" value="${user.email}">` +
        `<select id="role" class="swal2-input">
          <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
          <option value="Formateur" ${user.role === 'Formateur' ? 'selected' : ''}>Formateur</option>
        </select>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Mettre à jour',
      preConfirm: () => {
        const nom = (document.getElementById('nom') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const role = (document.getElementById('role') as HTMLSelectElement).value;

        if (!nom || !email || !role) {
          Swal.showValidationMessage('Tous les champs sont requis');
          return;
        }

        return { nom, email, role };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.utilisateurService.update(user.id!, result.value).subscribe({
          next: () => {
            Swal.fire('Mis à jour', 'Utilisateur modifié', 'success');
            this.fetchUtilisateurs();
          },
          error: () => Swal.fire('Erreur', 'Échec de la mise à jour', 'error')
        });
      }
    });
  }
}

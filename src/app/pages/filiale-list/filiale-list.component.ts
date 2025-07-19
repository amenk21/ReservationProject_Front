import { Component, OnInit } from '@angular/core';
import { FilialeService, Filiale } from 'src/app/services/filiale.service';
import Swal from 'sweetalert2';
import { CountUp } from 'countup.js';


@Component({
  selector: 'app-filiale-list',
  templateUrl: './filiale-list.component.html',
  styleUrls: ['./filiale-list.component.scss']
})
export class FilialeListComponent implements OnInit {
  filiales: Filiale[] = [];
  loading = false;
  error: string | null = null;

  constructor(private filialeService: FilialeService) {}

  ngOnInit(): void {
    this.loadFiliales();
  }

  loadFiliales(): void {
    this.loading = true;
    this.error = null;
    this.filialeService.getAll().subscribe({
      next: (data) => {
        this.filiales = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Erreur lors du chargement des filiales.";
        this.loading = false;
        console.error(err);
      }
    });
  }
  animateCounter() {
  const countUp = new CountUp('counter-number', this.filiales.length, {
    duration: 1.5,
    easingFn: (t, b, c, d) => {
      t /= d/2;
      if (t < 1) return c/2*t*t*t + b;
      t -= 2;
      return c/2*(t*t*t + 2) + b;
    }
  });
  if (!countUp.error) {
    countUp.start();
  } else {
    console.error(countUp.error);
  }
}

  openAddFilialeModal(): void {
    Swal.fire({
      title: 'Ajouter une nouvelle filiale',
      html: `
        <div class="form-group">
          <label for="nom">Nom</label>
          <input id="nom" class="swal2-input" placeholder="Nom de la filiale">
        </div>
        <div class="form-group">
          <label for="telephone">Téléphone</label>
          <input id="telephone" class="swal2-input" placeholder="Numéro de téléphone">
        </div>
        <div class="form-group">
          <label for="adresse">Adresse</label>
          <input id="adresse" class="swal2-input" placeholder="Adresse complète">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        return {
          nom: (document.getElementById('nom') as HTMLInputElement).value,
          telephone: (document.getElementById('telephone') as HTMLInputElement).value,
          adresse: (document.getElementById('adresse') as HTMLInputElement).value
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.addFiliale(result.value);
      }
    });
  }

  addFiliale(data: {nom: string, telephone: string, adresse: string}): void {
    this.filialeService.add(data).subscribe({
      next: () => {
        Swal.fire('Succès!', 'La filiale a été ajoutée avec succès.', 'success');
        this.loadFiliales();
      },
      error: (err) => {
        Swal.fire('Erreur!', "Une erreur s'est produite lors de l'ajout.", 'error');
        console.error(err);
      }
    });
  }

  openEditModal(filiale: Filiale): void {
    Swal.fire({
      title: 'Modifier la filiale',
      html: `
        <div class="form-group">
          <label for="edit-nom">Nom</label>
          <input id="edit-nom" class="swal2-input" value="${filiale.nom}">
        </div>
        <div class="form-group">
          <label for="edit-telephone">Téléphone</label>
          <input id="edit-telephone" class="swal2-input" value="${filiale.telephone}">
        </div>
        <div class="form-group">
          <label for="edit-adresse">Adresse</label>
          <input id="edit-adresse" class="swal2-input" value="${filiale.adresse}">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        return {
          id: filiale.id,
          nom: (document.getElementById('edit-nom') as HTMLInputElement).value,
          telephone: (document.getElementById('edit-telephone') as HTMLInputElement).value,
          adresse: (document.getElementById('edit-adresse') as HTMLInputElement).value
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.updateFiliale(result.value);
      }
    });
  }

  updateFiliale(data: any): void {
    this.filialeService.update(data.id, data).subscribe({
      next: () => {
        Swal.fire('Succès!', 'La filiale a été modifiée avec succès.', 'success');
        this.loadFiliales();
      },
      error: (err) => {
        Swal.fire('Erreur!', "Une erreur s'est produite lors de la modification.", 'error');
        console.error(err);
      }
    });
  }

  confirmDelete(id: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas annuler cette action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d92550',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteFiliale(id);
      }
    });
  }

  deleteFiliale(id: string): void {
    this.filialeService.delete(id).subscribe({
      next: () => {
        Swal.fire('Supprimé!', 'La filiale a été supprimée.', 'success');
        this.loadFiliales();
      },
      error: (err) => {
        Swal.fire('Erreur!', "Une erreur s'est produite lors de la suppression.", 'error');
        console.error(err);
      }
    });
  }
}
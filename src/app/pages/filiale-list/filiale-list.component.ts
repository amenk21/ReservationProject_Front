import { Component, OnInit } from '@angular/core';
import { FilialeService, Filiale } from 'src/app/services/filiale.service';
import { SalleService, Salle, StatutSalle } from 'src/app/services/salle.service';

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

  constructor(private filialeService: FilialeService,  private salleService: SalleService
) {}

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
 openAddSalleModal(filialeId: string): void {
    Swal.fire({
      title: '<span style="color: #5e72e4; font-size: 1.5rem; font-weight: 600">Ajouter une salle</span>',
      html: `
        <style>
          .swal2-popup {
            font-family: 'Poppins', sans-serif;
            border-radius: 12px;
          }
          .swal2-popup .swal2-input, 
          .swal2-popup .swal2-select,
          .swal2-popup .swal2-textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            background-color: #f8f9fe;
            transition: all 0.3s;
            font-size: 0.95rem;
            color: #2d3748;
            margin: 0.5rem 0;
          }
          .swal2-popup .swal2-input:focus, 
          .swal2-popup .swal2-select:focus {
            border-color: #5e72e4;
            box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.15);
            outline: none;
          }
          .swal2-popup .swal2-select {
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 1em;
          }
          .swal2-popup .swal2-label {
            display: block;
            margin-bottom: 0.5rem;
            color: #525f7f;
            font-weight: 500;
            font-size: 0.9rem;
            text-align: left;
            width: 100%;
          }
          .swal2-popup .swal2-actions {
            margin-top: 1.5rem;
            gap: 0.75rem;
          }
          .swal2-popup .swal2-styled {
            border-radius: 8px !important;
            padding: 0.75rem 1.5rem !important;
            font-weight: 600 !important;
            font-size: 0.9rem !important;
            transition: all 0.2s !important;
          }
          .swal2-popup .swal2-confirm {
            background-color: #5e72e4 !important;
          }
          .swal2-popup .swal2-confirm:hover {
            background-color: #4a5acf !important;
            transform: translateY(-1px);
          }
          .swal2-popup .swal2-cancel:hover {
            background-color: #e03150 !important;
            transform: translateY(-1px);
          }
          @media (max-width: 600px) {
            .swal2-popup {
              width: 90% !important;
              margin: 0 auto !important;
            }
          }
        </style>
        
        <div style="text-align: left; width: 100%">
          <div style="position: relative; margin-bottom: 1.5rem;">
            <label class="swal2-label">Nom de la salle</label>
            <i class="fas fa-door-open" style="position: absolute; left: 15px; top: 40px; color: #5e72e4;"></i>
            <input id="salle-nom" class="swal2-input" placeholder="Ex: Salle de réunion" style="padding-left: 40px !important;">
          </div>
          
          <div style="position: relative; margin-bottom: 1.5rem;">
            <label class="swal2-label">Capacité</label>
            <i class="fas fa-users" style="position: absolute; left: 15px; top: 40px; color: #5e72e4;"></i>
            <input type="number" id="salle-capacite" class="swal2-input" placeholder="Nombre de places" min="1" style="padding-left: 40px !important;">
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label class="swal2-label">Statut</label>
            <select id="salle-statut" class="swal2-select">
              <option value="${StatutSalle.Disponible}">Disponible</option>
              <option value="${StatutSalle.Reservée}">Réservée</option>
              <option value="${StatutSalle.EnMaintenance}">En Maintenance</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-plus-circle"></i> Ajouter',
      cancelButtonText: '<i class="fas fa-times"></i> Annuler',
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      focusConfirm: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      preConfirm: () => {
        const nom = (document.getElementById('salle-nom') as HTMLInputElement).value;
        const capacite = (document.getElementById('salle-capacite') as HTMLInputElement).value;
        
        if (!nom) {
          Swal.showValidationMessage('Le nom de la salle est requis');
          return false;
        }
        
        if (!capacite || parseInt(capacite) <= 0) {
          Swal.showValidationMessage('Veuillez entrer une capacité valide');
          return false;
        }
        
        return {
          nom: nom,
          capacite: parseInt(capacite),
          statut: (document.getElementById('salle-statut') as HTMLSelectElement).value as StatutSalle,
          filialeId: filialeId
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.addSalle(result.value);
      }
    });
  }

  addSalle(salle: Salle): void {
    this.salleService.add(salle).subscribe({
      next: () => {
        Swal.fire({
          title: 'Succès!',
          text: 'La salle a été ajoutée avec succès.',
          icon: 'success',
          confirmButtonColor: '#5e72e4',
          timer: 2000
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Erreur!',
          text: "Une erreur s'est produite lors de l'ajout de la salle.",
          icon: 'error',
          confirmButtonColor: '#f5365c'
        });
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
  openSallesDetailsModal(filialeId: string): void {
  this.loading = true;
  this.salleService.getByFilialeId(filialeId).subscribe({
    next: (salles) => {
      this.loading = false;
      this.showSallesDetails(filialeId, salles);
    },
    error: (err) => {
      this.loading = false;
      Swal.fire('Erreur!', "Impossible de charger les salles de cette filiale.", 'error');
      console.error(err);
    }
  });
}

private showSallesDetails(filialeId: string, salles: Salle[]): void {
  const filiale = this.filiales.find(f => f.id === filialeId);
  
  Swal.fire({
    title: `<span style="color: #5e72e4; font-size: 1.5rem; font-weight: 600">Salles de ${filiale?.nom}</span>`,
    html: `
      <style>
        .salles-container {
          max-height: 60vh;
          overflow-y: auto;
          padding-right: 10px;
        }
        .salle-item {
          background: #f8f9fe;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          border-left: 4px solid #5e72e4;
          transition: all 0.3s;
        }
        .salle-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .salle-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .salle-title {
          font-weight: 600;
          color: #5e72e4;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
        }
        .salle-title i {
          margin-right: 10px;
          font-size: 1.2rem;
        }
        .salle-capacity {
          background: #e9ecef;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .salle-status {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: 5px;
        }
        .status-disponible {
          background: #2dce891a;
          color: #2dce89;
        }
        .status-reservee {
          background: #fb63401a;
          color: #fb6340;
        }
        .status-maintenance {
          background: #f5365c1a;
          color: #f5365c;
        }
        .no-salles {
          text-align: center;
          padding: 20px;
          color: #adb5bd;
        }
        .no-salles i {
          font-size: 2rem;
          margin-bottom: 10px;
        }
      </style>
      
      <div class="salles-container">
        ${salles.length > 0 ? 
          salles.map(salle => `
            <div class="salle-item">
              <div class="salle-header">
                <div class="salle-title">
                  <i class="fas fa-door-open"></i>
                  ${salle.nom}
                </div>
                <div class="salle-capacity">
                  <i class="fas fa-users"></i> ${salle.capacite} places
                </div>
              </div>
              <div class="salle-status status-${salle.statut.toLowerCase().replace('é', 'e')}">
                <i class="fas ${this.getStatusIcon(salle.statut)}"></i> ${salle.statut}
              </div>
            </div>
          `).join('') 
          : `
          <div class="no-salles">
            <i class="fas fa-door-closed"></i>
            <p>Aucune salle disponible pour cette filiale</p>
          </div>
          `}
      </div>
    `,
    width: '800px',
    showConfirmButton: false,
    showCloseButton: true,
    background: '#fff',
    backdrop: 'rgba(0,0,0,0.05)'
  });
}

private getStatusIcon(statut: StatutSalle): string {
  switch(statut) {
    case StatutSalle.Disponible: return 'fa-check-circle';
    case StatutSalle.Reservée: return 'fa-calendar-check';
    case StatutSalle.EnMaintenance: return 'fa-tools';
    default: return 'fa-info-circle';
  }
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
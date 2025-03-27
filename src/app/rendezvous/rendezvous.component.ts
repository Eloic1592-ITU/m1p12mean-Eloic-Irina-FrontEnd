import { Component } from '@angular/core';
import { Rendezvous } from './rendezvous.model'; // Importation du modèle

@Component({
  selector: 'app-rendezvous',
  standalone: false,
  templateUrl: './rendezvous.component.html',
  styleUrls: ['./rendezvous.component.css']
})
export class RendezvousComponent {
  rendezvousList: Rendezvous[] = [
    {
      id: 1,
      nom: 'Jean Dupont',
      dateEnvoi: '20 mars 2025',
      dateRendezvous: '25 mars 2025',
      heure: '14:00',
      status: 'Valide par l\'administrateur il y a 3 heures',
      clientImage: 'client1.jpg'
    }
  ];

  // Variable pour déterminer si on est en mode ajout ou modification
  isEditMode: boolean = false;
  currentRdv: Rendezvous | null = null;

  // Fonction pour supprimer un rendez-vous
  deleteRendezvous(id: number): void {
    this.rendezvousList = this.rendezvousList.filter(rdv => rdv.id !== id);
  }

  // Fonction pour activer le mode édition et remplir le formulaire
  editRendezvous(rdv: Rendezvous): void {
    this.isEditMode = true;
    this.currentRdv = { ...rdv }; // Créer une copie pour ne pas modifier l'original pendant l'édition
  }

  // Fonction pour ajouter un nouveau rendez-vous
  addRendezvous(newRendezvous: Rendezvous): void {
    newRendezvous.id = this.rendezvousList.length + 1; // Générer un nouvel ID
    this.rendezvousList.push(newRendezvous);
  }

  // Fonction pour enregistrer un rendez-vous (ajout ou modification)
  saveRendezvous(rdv: Rendezvous): void {
    if (this.isEditMode && this.currentRdv) {
      // Modification d'un rendez-vous existant
      const index = this.rendezvousList.findIndex(r => r.id === rdv.id);
      if (index !== -1) {
        this.rendezvousList[index] = rdv;
      }
    } else {
      // Ajout d'un nouveau rendez-vous
      this.addRendezvous(rdv);
    }
    this.resetForm();
  }

  // Fonction pour réinitialiser le formulaire
  resetForm(): void {
    this.isEditMode = false;
    this.currentRdv = null;
  }
}

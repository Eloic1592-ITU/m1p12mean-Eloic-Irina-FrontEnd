import { Component } from '@angular/core';

@Component({
  selector: 'app-evenement',
  standalone: false,
  templateUrl: './evenement.component.html',
  styleUrls: ['./evenement.component.css']
})
export class EvenementComponent {
  searchQuery: string = '';  // Variable pour stocker le texte de recherche

  events = [
    {
      name: 'Concert de Rock',
      description: 'Un concert de rock avec plusieurs groupes locaux.',
      startDate: new Date('2025-03-25'),
      endDate: new Date('2025-03-26'),
      img: 'event1.jpg'
    },
    {
      name: 'Festival de Cinéma',
      description: 'Projection des meilleurs films de l\'année.',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-05'),
      img: 'event2.jpg'
    },
    {
      name: 'Salon de l\'Automobile',
      description: 'Exposition des derniers modèles de véhicules de luxe.',
      startDate: new Date('2025-04-10'),
      endDate: new Date('2025-04-12'),
      img: 'event3.jpg'
    }
  ];

  newEvent: any = { name: '', description: '', startDate: '', endDate: '', img: 'default.jpg' };

  isModalOpen: boolean = false;
  isEditMode: boolean = false;

  // Méthode pour filtrer les événements selon la recherche
  filteredEvents() {
    if (!this.searchQuery) {
      return this.events;
    }
    return this.events.filter(event =>
      event.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Ouvrir le modal pour ajouter un événement
  openAddModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.newEvent = { name: '', description: '', startDate: '', endDate: '', img: 'default.jpg' };
  }

  // Ouvrir le modal pour modifier un événement
  openEditModal(index: number) {
    this.isEditMode = true;
    this.newEvent = { ...this.events[index] };  // Cloner l'événement pour éviter les références directes
    this.isModalOpen = true;
  }

  // Fermer le modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Ajouter un nouvel événement
  addEvent() {
    if (this.newEvent.name && this.newEvent.description && this.newEvent.startDate && this.newEvent.endDate) {
      this.events.push({ ...this.newEvent });
      this.closeModal();
    }
  }

  // Mettre à jour un événement existant
  updateEvent() {
    const index = this.events.findIndex(event => event.name === this.newEvent.name);  // Utiliser un critère unique pour l'identification
    if (index !== -1) {
      this.events[index] = { ...this.newEvent };  // Mettre à jour l'événement dans la liste
      this.closeModal();  // Fermer le modal après la mise à jour
    }
  }

  // Supprimer un événement
  deleteEvent(index: number) {
    this.events.splice(index, 1);
  }
}

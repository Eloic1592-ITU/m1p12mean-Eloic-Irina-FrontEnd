import { Component } from '@angular/core';

@Component({
  selector: 'app-promotion',
  standalone: false,
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.css'
})
export class PromotionComponent {

  // Variables pour gérer l'état du modal et la promotion en cours de modification
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  currentPromotion: any = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    discount: 0,
    code: ''
  };

  // Liste des promotions
  promotions = [
    {
      name: 'Promotion sur le Concert de Rock',
      description: 'Réduction sur les billets',
      startDate: '2025-03-25',
      endDate: '2025-03-26',
      discount: 20,
      code: 'ROCK20',
      img: 'promotion1.jpg'
    },
    {
      name: 'Promotion Festival de Cinéma',
      description: '10% de réduction sur les tickets',
      startDate: '2025-04-01',
      endDate: '2025-04-05',
      discount: 10,
      code: 'CINEMA10',
      img: 'promotion2.jpg'
    },
    {
      name: 'Promotion Salon de l\'Automobile',
      description: 'Remise sur les véhicules de luxe',
      startDate: '2025-04-10',
      endDate: '2025-04-12',
      discount: 15,
      code: 'AUTO15',
      img: 'promotion3.jpg'
    }
  ];

  // Méthode pour ouvrir le modal d'ajout
  openAddModal() {
    this.isEditMode = false;
    this.currentPromotion = { name: '', description: '', startDate: '', endDate: '', discount: 0, code: '' };
    this.isModalOpen = true;
  }

  // Méthode pour ouvrir le modal de modification
  openEditModal(index: number) {
    this.isEditMode = true;
    this.currentPromotion = { ...this.promotions[index] }; // Cloner l'objet pour ne pas modifier directement dans la liste
    this.isModalOpen = true;
  }

  // Méthode pour fermer le modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Méthode pour ajouter une nouvelle promotion
  addPromotion() {
    if (this.currentPromotion.name && this.currentPromotion.description) {
      this.promotions.push({ ...this.currentPromotion, img: 'default.jpg' });
      this.closeModal();
    }
  }

  // Méthode pour modifier une promotion existante
  updatePromotion() {
    const index = this.promotions.findIndex(promotion => promotion.code === this.currentPromotion.code);
    if (index !== -1) {
      this.promotions[index] = { ...this.currentPromotion }; // Mettre à jour les données de la promotion
      this.closeModal();
    }
  }

  // Méthode pour supprimer une promotion
  deletePromotion(index: number) {
    this.promotions.splice(index, 1);
  }
}

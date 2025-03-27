import { Component } from '@angular/core';

@Component({
  selector: 'app-liste-service',
  standalone: false,
  templateUrl: './liste-service.component.html',
  styleUrl: './liste-service.component.css'
})
export class ListeServiceComponent {


  searchQuery: string = '';  // Variable pour stocker le texte de recherche

  services = [
    {
      name: 'Service Mécanique',
      price: 500000,
      description: 'Réparation moteur et révision complète du véhicule.',
      registration: 'ABC 1234',
      img: 'service1.jpg'
    },
    {
      name: 'Service Climatisation',
      price: 150000,
      description: 'Entretien et recharge du système de climatisation.',
      registration: 'DEF 5678',
      img: 'service2.jpg'
    },
    {
      name: 'Service Pneumatiques',
      price: 200000,
      description: 'Changement de pneus et équilibrage.',
      registration: 'GHI 9876',
      img: 'service3.jpg'
    },
    {
      name: 'Service Électricité',
      price: 300000,
      description: 'Diagnostic et réparation des circuits électriques du véhicule.',
      registration: 'JKL 2345',
      img: 'service4.jpg'
    }
  ];

  // Méthode pour filtrer les services selon la recherche
  filteredServices() {
    if (!this.searchQuery) {
      return this.services;  // Si aucune recherche, on retourne tous les services
    }

    return this.services.filter(service =>
      service.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Méthode appelée lors du clic sur le bouton de recherche
  searchServices() {
    // La recherche se fait déjà à chaque changement dans l'input via ngModel,
    // mais vous pouvez ajouter des actions supplémentaires ici si nécessaire.
    console.log('Recherche effectuée pour : ', this.searchQuery);
  }

   // Fonction pour supprimer un service
   deleteService(serviceToDelete: any) {
    this.services = this.services.filter(service => service !== serviceToDelete);
  }
}

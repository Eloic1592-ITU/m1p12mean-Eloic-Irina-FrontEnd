import { Component, OnInit } from '@angular/core';
import { RendezvousService } from '../../services/rendezvous/rendezvous.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-validationrendezvous',
  imports: [FormsModule,CommonModule],
  templateUrl: './validationrendezvous.component.html',
  styleUrl: './validationrendezvous.component.css'
})
export class ValidationrendezvousComponent implements OnInit {
  searchQuery: string = '';
  rendezvous: any[] = [];
  filteredResults: any[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5; // Nombre d'éléments par page
  totalPages: number = 1;


  constructor(
    private rendezvousService: RendezvousService,

  ) {}

  ngOnInit(): void {
    this.loadRendezvousClient();
  }


  loadRendezvousClient():void{
    this.rendezvousService.getConfirmedRendezvous().subscribe({
      next: (data) => {
        this.rendezvous = data;
        this.calculateTotalPages();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  
  // Pagination
  calculateTotalPages() {
    const totalItems = this.filteredResults.length > 0 ? this.filteredResults.length : this.rendezvous.length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
  }

  // Filtrage
  applyFilter() {
    if (!this.searchQuery) {
      this.filteredResults = [];
      this.currentPage = 1;
      this.calculateTotalPages();
      return;
    }
  
    const searchDate = new Date(this.searchQuery);
    // On normalise à minuit pour éviter les problèmes de fuseau horaire
    const searchDateStart = new Date(searchDate);
    searchDateStart.setHours(0, 0, 0, 0);
    
    const searchDateEnd = new Date(searchDate);
    searchDateEnd.setHours(23, 59, 59, 999);
  
    this.filteredResults = this.rendezvous.filter(rdv => {
      const rdvDate = new Date(rdv.dateheure);
      return rdvDate >= searchDateStart && rdvDate <= searchDateEnd;
    });
  
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  validRendezvous(rendezvous :any) {
    rendezvous.statut='Validé'
    this.rendezvousService.updateRendezvous(rendezvous._id,rendezvous)
      .subscribe({
        next: () => {
          this.loadRendezvousClient();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  refusRendezvous(rendezvous :any) {
    rendezvous.statut='Refusé'
    this.rendezvousService.updateRendezvous(rendezvous._id,rendezvous)
      .subscribe({
        next: () => {
          this.loadRendezvousClient();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  
  cancelRendezvous(rendezvous :any) {
    rendezvous.statut='Annulé'
    this.rendezvousService.updateRendezvous(rendezvous._id,rendezvous)
      .subscribe({
        next: () => {
          this.loadRendezvousClient();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }
  
  paginatedRendezvous() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const sourceArray = this.filteredResults.length > 0 ? this.filteredResults : this.rendezvous;
    return sourceArray.slice(startIndex, endIndex);
  }
  getStatusColor(status: string): string {
    switch(status.toLowerCase()) {
      case 'valide':
        return '#28a745'; // Vert
      case 'refuse':
        return '#dc3545'; // Rouge
      case 'annule':
        return '#ffc107'; // Jaune (version sombre pour meilleure lisibilité)
      default:
        return '#6c757d'; // Gris pour les statuts non définis
    }
  }
}

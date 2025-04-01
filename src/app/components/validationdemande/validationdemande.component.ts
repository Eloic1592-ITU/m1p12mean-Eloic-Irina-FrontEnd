import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DemandeService } from '../../services/demande/demande.service';
@Component({
  selector: 'app-validationdemande',
  imports: [FormsModule,CommonModule],
  templateUrl: './validationdemande.component.html',
  styleUrl: './validationdemande.component.css'
})
export class ValidationdemandeComponent implements OnInit{
  startDate: string = '';
  endDate: string = '';
  demandemecaniciens: any[] = [];
  filteredResults: any[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5; // Nombre d'éléments par page
  totalPages: number = 1;


  constructor(
     private demandeservice: DemandeService,
 
   ) {}

  ngOnInit(): void {
    this.loadDemandeMecanicien();
  }


  loadDemandeMecanicien():void{
    this.demandeservice.getDemandeMecanicien().subscribe({
      next: (data) => {
        this.demandemecaniciens = data;
        this.calculateTotalPages();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
  // Pagination
  calculateTotalPages() {
    const totalItems = this.filteredResults.length > 0 ? this.filteredResults.length : this.demandemecaniciens.length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
  }

  // Filtrage
  applyFilter() {
    const defaultStartDate = new Date();
    defaultStartDate.setHours(0, 0, 0, 0);
    
    const defaultEndDate = new Date();
    defaultEndDate.setHours(23, 59, 59, 999);
  
    const searchStart = this.startDate 
      ? new Date(this.startDate)
      : new Date(defaultStartDate);
    searchStart.setHours(0, 0, 0, 0);
  
    const searchEnd = this.endDate 
      ? new Date(this.endDate)
      : new Date(defaultEndDate);
    searchEnd.setHours(23, 59, 59, 999);
  
    if (!this.startDate && this.endDate) {
      searchStart.setFullYear(1970, 0, 1); // Date très ancienne
    }
  
    if (this.startDate && !this.endDate) {
      searchEnd.setFullYear(2100, 0, 1); // Date très lointaine
    }
      this.filteredResults = this.demandemecaniciens.filter(dmd => {
      const dateDebut = new Date(dmd.datedebut);
      const dateFin = dmd.datefin ? new Date(dmd.datefin) : new Date(dmd.datedebut);
      
      return (dateDebut >= searchStart && dateDebut <= searchEnd) ||
             (dateFin >= searchStart && dateFin <= searchEnd) ||
             (dateDebut <= searchStart && dateFin >= searchEnd);
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
  paginatedDemande() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const sourceArray = this.filteredResults.length > 0 ? this.filteredResults : this.demandemecaniciens;
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

  validerDemande(rendezvous :any) {
    rendezvous.statut='Validé'
    this.demandeservice.updateDemande(rendezvous._id,rendezvous)
      .subscribe({
        next: () => {
          this.loadDemandeMecanicien();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  refusDemande(rendezvous :any) {
    rendezvous.statut='Refusé'
    this.demandeservice.updateDemande(rendezvous._id,rendezvous)
      .subscribe({
        next: () => {
          this.loadDemandeMecanicien();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  
  // cancelRendezvous(rendezvous :any) {
  //   rendezvous.statut='Annulé'
  //   this.demandeservice.updateDemande(rendezvous._id,rendezvous)
  //     .subscribe({
  //       next: () => {
  //         this.loadDemandeMecanicien();
  //       },
  //       error: (err) => console.error('Erreur:', err)
  //     });
  // }
  

}

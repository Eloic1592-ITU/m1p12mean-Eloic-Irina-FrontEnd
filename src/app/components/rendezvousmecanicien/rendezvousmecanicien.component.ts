import { Component, OnInit } from '@angular/core';
import { RendezvousService } from '../../services/rendezvous/rendezvous.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rendezvousmecanicien',
  imports: [FormsModule,CommonModule],
  templateUrl: './rendezvousmecanicien.component.html',
  styleUrl: './rendezvousmecanicien.component.css'
})
export class RendezvousmecanicienComponent implements OnInit {
  searchQuery: string = '';
  rendezvous: any[] = [];
  filteredResults: any[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5; // Nombre d'éléments par page
  totalPages: number = 1;

  ngOnInit(): void {
      this.loadRendezvous();
  }

  
  constructor(
    private rendezvousService: RendezvousService,
    private router: Router,

  ) {}

  loadRendezvous(): void {
    this.rendezvousService.getValidatedRendezvous().subscribe({
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
  resetFilter() {
    this.searchQuery = '';
    this.filteredResults = [];
    this.currentPage = 1;
    this.calculateTotalPages();
  }
  
  hasActiveFilters(): boolean {
    return !!this.searchQuery ;
  }


  // Pagination
  filteredRendezvous() {
    return this.filteredResults.length > 0 ? this.filteredResults : this.rendezvous;
  }

    
  firstItemOnPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  lastItemOnPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredRendezvous().length);
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
  
  voirservices(rendezvousId: string,clientId: string): void{
    this.router.navigate(['/servicevehiculeclient', rendezvousId,clientId]);
  }
  paginatedRendezvous() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const sourceArray = this.filteredResults.length > 0 ? this.filteredResults : this.rendezvous;
    return sourceArray.slice(startIndex, endIndex);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RendezvousService } from '../../services/rendezvous/rendezvous.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  standalone: true,
  selector: 'app-rendezvous',
  imports: [CommonModule, FormsModule],
  templateUrl: './rendezvous.component.html',
  styleUrls: ['./rendezvous.component.css']
})
export class RendezvousComponent implements OnInit {
  searchQuery: string = '';
  rendezvous: any[] = [];
  filteredResults: any[] = [];
  newRendezvous: any = { 
    clientId:'',
    dateheure: '',
    description: '',
    statut: 'En cours'
  };
  isModalOpen = false;
  isEditMode = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5; // Nombre d'éléments par page
  totalPages: number = 1;
  

  constructor(
    private rendezvousService: RendezvousService,
    private storageService:StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeDefaultClientId();
    this.loadRendezvous();
  }

  loadRendezvous(): void {
    this.rendezvousService.getRendezvous(this.storageService.getUserId()).subscribe({
      next: (data) => {
        this.rendezvous = data;
        this.calculateTotalPages();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
  initializeDefaultClientId(): void {
    const userId = this.storageService.getUserId();
    if (userId) {
      this.newRendezvous.clientId = userId;
      // alert('userId'+userId);
    } else {
      console.warn('ID utilisateur non trouvé');
    }
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
    return !!this.searchQuery || !!this.searchQuery;
  }


  // Rendez-vous d'aujourd'hui
  todayRendezvous() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.rendezvous.filter(rdv => {
      const rdvDate = new Date(rdv.dateheure);
      rdvDate.setHours(0, 0, 0, 0);
      return rdvDate.getTime() === today.getTime();
    });
  }

  
  // Pagination
  filteredRendezvous() {
    return this.filteredResults.length > 0 ? this.filteredResults : this.rendezvous;
  }

  // Pagination
  calculateTotalPages() {
    const totalItems = this.filteredResults.length > 0 ? this.filteredResults.length : this.rendezvous.length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
  }
  
  firstItemOnPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  lastItemOnPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredRendezvous().length);
  }


  paginatedRendezvous() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const sourceArray = this.filteredResults.length > 0 ? this.filteredResults : this.rendezvous;
    return sourceArray.slice(startIndex, endIndex);
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
  // Gestion des modales
  openAddModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.newRendezvous = { 
      clientId: this.storageService.getUserId() || '',
      dateheure: '',
      description: '',
      statut: 'En cours'
    };
  }

  openEditModal(rendezvous: any) {
    this.isEditMode = true;
    this.newRendezvous = { ...rendezvous,     statut: 'En cours' };
    // Convertir le timestamp en format datetime-local
    if (this.newRendezvous.dateheure) {
      const date = new Date(this.newRendezvous.dateheure);
      this.newRendezvous.dateheure = date.toISOString().slice(0, 16);
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Opérations CRUD
  addRendezvous(): void {
    if (this.newRendezvous.dateheure) {
      this.newRendezvous.dateheure = new Date(this.newRendezvous.dateheure).getTime();
    }
    this.rendezvousService.addRendezvous(this.newRendezvous).subscribe({
      next: () => {
        this.loadRendezvous();
        this.closeModal();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  updateRendezvous() {
    // Convertir la date en timestamp
    if (this.newRendezvous.dateheure) {
      this.newRendezvous.dateheure = new Date(this.newRendezvous.dateheure).getTime();
    }
    
    this.rendezvousService.updateRendezvous(this.newRendezvous._id, this.newRendezvous)
      .subscribe({
        next: () => {
          this.loadRendezvous();
          this.closeModal();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  navigateToEdit(clientId: string): void {
    this.router.navigate(['/edit-rendezvous', clientId]);
  }

  detailservicevehicule(rendezvousId: string): void {
    this.router.navigate(['/detailservicevehicule', rendezvousId]);
  }



  deleteRendezvous(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      this.rendezvousService.deleteRendezvous(id).subscribe({
        next: () => this.loadRendezvous(),
        error: (err) => console.error('Erreur:', err)
      });
    }
  }
}
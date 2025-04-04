import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ClientService } from '../../services/client/client.service';
import { ServiceService } from '../../services/service/service.service';
import { MaintenanceService } from '../../services/maintenance/maintenance.service';
import { StorageService } from '../../services/storage/storage.service';
import { AuthenticatedLayoutComponent } from '../shared/authenticated-layout/authenticated-layout.component';

@Component({
  selector: 'app-service-client',
  imports: [FormsModule,CommonModule],
  templateUrl: './service-client.component.html',
  styleUrls: ['./service-client.component.css']
})
export class ServiceClientComponent implements OnInit {
  // Données des services
  services: any[] = [];
  filteredServices: any[] = [];
  pagedServices: any[] = [];
  searchTerm = '';
  currentServicePage = 1;
  itemsPerPage = 5;
  totalServicePages = 1;
  searchQuery: string = '';  
  filteredResults: any[] = [];

  // Données des conseils
  advices: any[] = [];
  pagedAdvices: any[] = [];
  currentPage = 1;
  currentAdvicePage = 1;
  adviceItemsPerPage = 6;
  totalAdvicePages = 1;

  showDropdown = false;
  selectedAdvice: any = null; // Pour stocker le conseil sélectionné

  constructor(
    private authService: AuthService,
    private clientservice: ClientService,
    private router: Router,
    private serviceservice:ServiceService,
    private maintenanceService:MaintenanceService,
    private storageService:StorageService,
  ){}

  ngOnInit(): void {
    this.loadServices();
    this.loadAdvices();
  }

  // Chargement des données
  loadServices(): void {
    this.serviceservice.getService().subscribe({
      next: (data) => {
        console.log('Données reçues:', data); 
        this.services = data;
        this.updateServicePagination();
      },
      error: (err) => console.error('Erreur:', err)
    });

  }

  loadAdvices(): void {
    this.maintenanceService.getAllMaintenances().subscribe({
      next: (data) => {
        console.log('Données reçues:', data); 
        this.advices=data;
        this.updateAdvicePagination();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  // Filtrage des services
  applyFilters() {
    let results = this.services;
    
    // Filtre texte
    if (this.searchQuery) {
      results = results.filter(service =>
        service.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        service.descriptioncourte.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        service.descriptioncomplete.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    this.filteredResults = results;
    this.currentPage = 1;
    this.updateServicePagination();
  }

  // Pagination des services
  updateServicePagination(): void {
    this.totalServicePages = Math.ceil(this.listfilteredServices().length / this.itemsPerPage);
    const startIndex = (this.currentServicePage - 1) * this.itemsPerPage;
    this.pagedServices = this.listfilteredServices().slice(startIndex, startIndex + this.itemsPerPage);
  
  }
  // Pagination
  listfilteredServices() {
    return this.filteredResults.length > 0 ? this.filteredResults : this.services;
  }

  changeServicePage(page: number): void {
    if (page >= 1 && page <= this.totalServicePages) {
      this.currentServicePage = page;
      this.updateServicePagination();
    }
  }

  getServicePageNumbers(): number[] {
    return this.calculatePageNumbers(this.currentServicePage, this.totalServicePages);
  }

  // Pagination des conseils
  updateAdvicePagination(): void {
    this.totalAdvicePages = Math.ceil(this.advices.length / this.adviceItemsPerPage);
    const startIndex = (this.currentAdvicePage - 1) * this.adviceItemsPerPage;
    this.pagedAdvices = this.advices.slice(startIndex, startIndex + this.adviceItemsPerPage);
  }

  changeAdvicePage(page: number): void {
    if (page >= 1 && page <= this.totalAdvicePages) {
      this.currentAdvicePage = page;
      this.updateAdvicePagination();
    }
  }

  getAdvicePageNumbers(): number[] {
    return this.calculatePageNumbers(this.currentAdvicePage, this.totalAdvicePages);
  }

  // Méthode utilitaire pour les numéros de page
  private calculatePageNumbers(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Actions
  takeAppointment(service: any): void {
    this.router.navigate(['/rendezvous'], { 
      state: { service } 
    });
  }
  // Ouvre le modal avec les détails du conseil
  viewAdviceDetails(advice: any): void {
    this.selectedAdvice = advice;
    document.body.style.overflow = 'hidden'; // Empêche le scroll de la page
  }

  // Ferme le modal
  closeModal(): void {
    this.selectedAdvice = null;
    document.body.style.overflow = 'auto'; // Rétablit le scroll
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  changeProfile() {
    this.router.navigate(['/edit-client',this.storageService.getUserId()]);
    this.showDropdown = false;
  }
  logout() {
    console.log('Déconnexion demandée');
    this.authService.logout();
    this.showDropdown = false;
  }


  accueil(){ 
    this.router.navigate(['/accueil']);
  }
  rendezvous(){
    this.router.navigate(['/rendezvous']);
  }
  vehicules(){
    this.router.navigate(['/vehicule']);}
  entretien(){ 
    this.router.navigate(['/serviceclient']);
  }
}
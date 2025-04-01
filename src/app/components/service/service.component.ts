import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service/service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { formatDateForInput } from '../../utils/utils';

@Component({
  standalone: true,
  selector: 'app-service',
  imports: [CommonModule, FormsModule],
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  searchQuery: string = '';
  priceFilter: string = '';
  categoryFilter: string = '';
  services: any[] = [];
  filteredResults: any[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  newService: any = { 
    nom: '',
    descriptioncourte: '',
    descriptioncomplete: '',
    prix: 0,
    duree: '',
    categorie: '',
    promotion: [],
    image: 'default.jpg' 
  };
  selectedFile: File | null = null;

  isModalOpen = false;
  isEditMode = false;

  constructor(private serviceService: ServiceService, private router: Router) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getService().subscribe({
      next: (data) => {
        this.services = data;
        this.calculateTotalPages();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  // Filtres
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
    
    // Filtre prix
    if (this.priceFilter) {
      const priceValue = parseFloat(this.priceFilter);
      results = results.filter(service => service.prix <= priceValue);
    }
    
    // Filtre catégorie
    if (this.categoryFilter) {
      results = results.filter(service => 
        service.categorie.toLowerCase() === this.categoryFilter.toLowerCase()
      );
    }
    
    this.filteredResults = results;
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  resetFilters() {
    this.searchQuery = '';
    this.priceFilter = '';
    this.categoryFilter = '';
    this.filteredResults = [];
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  hasActiveFilters(): boolean {
    return !!this.searchQuery || !!this.priceFilter || !!this.categoryFilter;
  }

  // Pagination
  filteredServices() {
    return this.filteredResults.length > 0 ? this.filteredResults : this.services;
  }

  paginatedServices() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredServices().slice(startIndex, startIndex + this.itemsPerPage);
  }

  firstItemOnPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  lastItemOnPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredServices().length);
  }

  calculateTotalPages() {
    const totalItems = this.filteredServices().length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
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

  // Gestion des fichiers
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.newService.image = this.selectedFile.name;
    }
  }

  // Gestion des modales
  openAddModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.newService = { 
      nom: '',
      descriptioncourte: '',
      descriptioncomplete: '',
      prix: 0,
      duree: '',
      categorie: '',
      image: 'default.jpg' 
    };
  }

  openEditModal(service: any) {
    this.isEditMode = true;
    this.newService = { ...service };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // CRUD Operations
  addService(): void {
    this.serviceService.addService(this.newService)
      .subscribe({
        next: () => {
          this.loadServices();
          this.closeModal();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  updateService() {
    this.serviceService.updateService(this.newService._id, this.newService)
      .subscribe({
        next: () => {
          this.loadServices();
          this.closeModal();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  maintenance(serviceId: string): void {
    this.router.navigate(['/maintenance', serviceId]);
  }

  deleteService(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      this.serviceService.deleteService(id).subscribe({
        next: () => this.loadServices(),
        error: (err) => console.error('Erreur:', err)
      });
    }
  }

}
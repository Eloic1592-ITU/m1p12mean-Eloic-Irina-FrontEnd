import { Component, OnInit } from '@angular/core';
import { VehiculeService } from '../../services/vehicule/vehicule.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  standalone: true,
  selector: 'app-vehicule',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicule.component.html',
  styleUrls: ['./vehicule.component.css']
})
export class VehiculeComponent implements OnInit {
  searchQuery: string = '';
  vehicules: any[] = [];
  filteredResults: any[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  newVehicule: any = { 
    marque: '', 
    modele: '', 
    annee: 0, 
    Immatriculation: '', 
    kilometrage: '',
    image: 'default.jpg',
    clientId: ''
  };
  selectedFile: File | null = null;

  isModalOpen = false;
  isEditMode = false;

  constructor(
    private vehiculeservice: VehiculeService, 
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeDefaultClientId();
    this.loadVehicule();
  }

  initializeDefaultClientId(): void {
    const userId = this.storageService.getUserId();
    if (userId) {
      this.newVehicule.clientId = userId;
    } else {
      console.warn('ID utilisateur non trouvé');
    }
  }

  loadVehicule(): void {
    this.vehiculeservice.getVehiculesClient(this.storageService.getUserId()).subscribe({
      next: (data) => {
        this.vehicules = data;
        this.calculateTotalPages();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  // Filtres
  applyFilters() {
    if (!this.searchQuery) {
      this.filteredResults = [];
    } else {
      this.filteredResults = this.vehicules.filter(vehicule =>
        vehicule.marque.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        vehicule.modele.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        vehicule.Immatriculation.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  resetFilters() {
    this.searchQuery = '';
    this.filteredResults = [];
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  hasActiveFilters(): boolean {
    return !!this.searchQuery;
  }

  // Pagination
  filteredVehicules() {
    return this.filteredResults.length > 0 ? this.filteredResults : this.vehicules;
  }

  paginatedVehicules() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredVehicules().slice(startIndex, startIndex + this.itemsPerPage);
  }

  firstItemOnPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  lastItemOnPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredVehicules().length);
  }

  calculateTotalPages() {
    const totalItems = this.filteredVehicules().length;
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
      this.newVehicule.image = this.selectedFile.name;
    }
  }

  // Gestion des modales
  openAddModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.newVehicule = { 
      marque: '', 
      modele: '', 
      annee: 0, 
      Immatriculation: '', 
      kilometrage: '',
      image: 'default.jpg',
      clientId: this.storageService.getUserId()
    };
  }

  openEditModal(vehicule: any) {
    this.isEditMode = true;
    this.newVehicule = { ...vehicule };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // CRUD Operations
  addVehicule(): void {
    this.vehiculeservice.addVehicule(this.newVehicule).subscribe({
      next: () => {
        this.loadVehicule();
        this.closeModal();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  updateVehicule() {
    this.vehiculeservice.updateVehicule(this.newVehicule._id,this.newVehicule).subscribe({
      next: () => {
        this.loadVehicule();
        this.closeModal();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  deleteVehicule(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      this.vehiculeservice.deleteVehicule(id).subscribe({
        next: () => this.loadVehicule(),
        error: (err) => console.error('Erreur:', err)
      });
    }
  }

  detailservicevehicule(vehiculeId: string): void {
    this.router.navigate(['/servicevehicule', vehiculeId]);
  }
}
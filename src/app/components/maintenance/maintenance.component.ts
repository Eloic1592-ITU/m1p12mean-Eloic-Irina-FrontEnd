import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MaintenanceService } from '../../services/maintenance/maintenance.service';
@Component({
  standalone: true,
  selector: 'app-maintenance',
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {
  id: string | null = null;
  searchQuery: string = '';
  categoryFilter: string = '';
  difficultyFilter: string = '';
  maintenances: any[] = [];
  filteredResults: any[] = [];
  services: any[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  newMaintenance: any = { 
    titre: '',
    description: '',
    serviceId: '',
    categorie: '',
    difficulte: '',
    outilrequis: [],
    etapes: []
  };
  selectedFile: File | null = null;
  categories = ['Préventive', 'Corrective', 'Prédictive'];
  niveauxDifficulte = ['Facile', 'Moyen', 'Difficile'];

  isModalOpen = false;
  isEditMode = false;
  currentStepInput: string = '';

  constructor(
    private maintenanceService: MaintenanceService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadMaintenances(this.id);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  loadMaintenances(serviceId: any): void {
    this.maintenanceService.getMaintenancesbyService(serviceId).subscribe({
      next: (data) => {
        this.maintenances = data;
        this.associateServiceNames();
        this.calculateTotalPages();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  associateServiceNames(): void {
    this.maintenances.forEach(maint => {
      const service = this.services.find(s => s._id === maint.serviceId);
      maint.serviceName = service ? service.nom : 'Non spécifié';
    });
  }
  // Filtres
  applyFilters() {
    let results = this.maintenances;
    
    // Filtre texte
    if (this.searchQuery) {
      results = results.filter(maint =>
        (maint.titre && maint.titre.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (maint.description && maint.description.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (maint.serviceName && maint.serviceName.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }
    
    // // Filtre catégorie
    // if (this.categoryFilter) {
    //   results = results.filter(maint => 
    //     maint.categorie && maint.categorie.toLowerCase() === this.categoryFilter.toLowerCase()
    //   );
    // }
    
    // // Filtre difficulté
    // if (this.difficultyFilter) {
    //   results = results.filter(maint => 
    //     maint.difficulte && maint.difficulte.toLowerCase() === this.difficultyFilter.toLowerCase()
    //   );
    // }
    
    this.filteredResults = results;
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  resetFilters() {
    this.searchQuery = '';
    this.categoryFilter = '';
    this.difficultyFilter = '';
    this.filteredResults = [];
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  hasActiveFilters(): boolean {
    return !!this.searchQuery || !!this.categoryFilter || !!this.difficultyFilter;
  }

  // Pagination
  filteredMaintenances() {
    return this.filteredResults.length > 0 ? this.filteredResults : this.maintenances;
  }

  paginatedMaintenances() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMaintenances().slice(startIndex, startIndex + this.itemsPerPage);
  }

  firstItemOnPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  lastItemOnPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredMaintenances().length);
  }

  calculateTotalPages() {
    const totalItems = this.filteredMaintenances().length;
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

  // Gestion des modales
  openAddModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.newMaintenance = { 
      titre: '',
      description: '',
      serviceId: this.id || '',
      categorie: '',
      difficulte: '',
      outilrequis: [],
      etapes: []
    };
  }

  openEditModal(maintenance: any) {
    this.isEditMode = true;
    this.newMaintenance = { ...maintenance };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Gestion des étapes et outilrequis
  addStep() {
    if (this.currentStepInput.trim()) {
      if (!this.newMaintenance.etapes) this.newMaintenance.etapes = [];
      this.newMaintenance.etapes.push(this.currentStepInput.trim());
      this.currentStepInput = '';
    }
  }

  removeStep(index: number) {
    this.newMaintenance.etapes.splice(index, 1);
  }

  addOutil(outilrequis: string) {
    if (outilrequis.trim() && !this.newMaintenance.outilrequis.includes(outilrequis.trim())) {
      if (!this.newMaintenance.outilrequis) this.newMaintenance.outilrequis = [];
      this.newMaintenance.outilrequis.push(outilrequis.trim());
    }
  }

  removeOutil(index: number) {
    this.newMaintenance.outilrequis.splice(index, 1);
  }

  addMaintenance(): void {
    this.maintenanceService.createMaintenance(this.newMaintenance).subscribe({
      next: (newMaintenance) => {
        this.maintenances = [newMaintenance, ...this.maintenances];
        this.filteredResults = [newMaintenance, ...this.filteredResults];
        this.resetFilters();
        this.currentPage = 1;
        this.calculateTotalPages();
        this.closeModal();
        const service = this.services.find(s => s._id === newMaintenance.serviceId);
        if (service) {
          newMaintenance.serviceName = service.nom;
        }
      },
      error: (err) => {
        console.error('Erreur:', err);
      }
    });
  }

  updateMaintenance() {
    this.maintenanceService.updateMaintenance(this.newMaintenance._id, this.newMaintenance)
      .subscribe({
        next: () => {
          this.loadMaintenances(this.id);
          this.closeModal();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  deleteMaintenance(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette maintenance ?')) {
      this.maintenanceService.deleteMaintenance(id).subscribe({
        next: () => this.loadMaintenances(this.id),
        error: (err) => console.error('Erreur:', err)
      });
    }
  }

  getServiceName(serviceId: string): string {
    const service = this.services.find(s => s._id === serviceId);
    return service ? service.nom : 'Non spécifié';
  }
}
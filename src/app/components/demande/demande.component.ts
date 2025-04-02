import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DemandeService } from '../../services/demande/demande.service';
import { StorageService } from '../../services/storage/storage.service';
import { formatDateForInput } from '../../utils/utils';

@Component({
  selector: 'app-demande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.css']
})
export class DemandeComponent implements OnInit {
  id: string | null = null;
  searchQuery: string = '';
  dateFilter: string = '';
  demandes: any[] = [];
  filteredResults: any[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  newDemande: any = { 
    mecanicienId: '',
    type: '',
    description: '',
    datedebut: '',
    datefin: '',
    statut: 'En cours'
  };
  types = ['Absence', 'Permission', 'Conge'];
  statuts = ['En cours', 'Terminé', 'Annulé'];

  isModalOpen = false;
  isEditMode = false;

  constructor(
    private demandeService: DemandeService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes(): void {
    const userId = this.storageService.getUserId();
    this.demandeService.getDemande(userId).subscribe({
      next: (data) => {
        this.demandes = data;
        this.filteredResults = [...this.demandes];
        this.calculateTotalPages();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  // Filtres
  applyFilters() {
    let results = this.demandes;
    
    // Filtre texte
    if (this.searchQuery) {
      results = results.filter(demande =>
        demande.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        demande.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    // Filtre date
    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter);
      results = results.filter(demande => {
        const demandeDate = new Date(demande.datedebut);
        return demandeDate.toDateString() === filterDate.toDateString();
      });
    }
    
    this.filteredResults = results;
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  resetFilters() {
    this.searchQuery = '';
    this.dateFilter = '';
    this.filteredResults = [...this.demandes];
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  hasActiveFilters(): boolean {
    return !!this.searchQuery || !!this.dateFilter;
  }

  // Demandes en cours
  currentDemandes() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.demandes.filter(demande => {
      const start = new Date(demande.datedebut);
      const end = new Date(demande.datefin);
      return start <= today && end >= today;
    });
  }

  // Pagination
  filteredDemandes() {
    return this.filteredResults.length > 0 ? this.filteredResults : this.demandes;
  }

  paginatedDemandes() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDemandes().slice(startIndex, startIndex + this.itemsPerPage);
  }

  firstItemOnPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  lastItemOnPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredDemandes().length);
  }

  calculateTotalPages() {
    const totalItems = this.filteredDemandes().length;
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
    this.newDemande = { 
      mecanicienId: this.storageService.getUserId(),
      type: '',
      description: '',
      datedebut: '',
      datefin: '',
      statut: 'En cours'
    };
  }

  openEditModal(demande: any) {
    this.isEditMode = true;
    this.newDemande = { ...demande, 
      datedebut:formatDateForInput(demande.datedebut),
      datefin: formatDateForInput(demande.datefin) 
     };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // CRUD Operations
  addDemande(): void {
    this.demandeService.createDemande(this.newDemande).subscribe({
      next: () => {
        this.loadDemandes();
        this.closeModal();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  updateDemande() {
    this.demandeService.updateDemande(this.newDemande._id, this.newDemande)
      .subscribe({
        next: () => {
          this.loadDemandes();
          this.closeModal();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  deleteDemande(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.demandeService.deleteDemande(id).subscribe({
        next: () => this.loadDemandes(),
        error: (err) => console.error('Erreur:', err)
      });
    }
  }

  showActions(statut: string): boolean {
    const lowerStatut = statut.toLowerCase();
    return lowerStatut !== 'validé' && lowerStatut !== 'refusé';
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AvisService } from '../../../services/avis/avis.service';
import { StorageService } from '../../../services/storage/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-apercuavis',
  imports: [CommonModule, FormsModule],  
  templateUrl: './apercuavis.component.html',
  styleUrl: './apercuavis.component.css'
})
export class ApercuavisComponent implements OnInit {
  id: string | null = null;
  searchQuery:string='';
  avis: any[]=[];
  newAvis: any={
    clientId:'',
    description:'',
    note:0,
    servicevehiculeId:'',
    statut:'Publie'

  }

  filteredResults: any[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  isModalOpen = false;
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private avisService: AvisService,
    private storageService:StorageService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    alert(this.id);
    this.loadAvisClient();
  }



  loadAvisClient(): void{
    this.avisService.getAvisServiceVehicule(this.id).subscribe({
      next: (data) => {
        this.avis = data;
        this.calculateTotalPages();
      },
      error: (err) => console.error('Erreur:', err)
    });

  
}
  // Filtres
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
  
    this.filteredResults = this.avis.filter(avis => {
      const avisDate = new Date(avis.updatedAt);
      return avisDate >= searchDateStart && avisDate <= searchDateEnd;
    });
  
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  resetFilters() {
    this.searchQuery = '';
    this.filteredResults = [];
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  // Pagination
  filteredAvis() {
    return this.filteredResults.length > 0 ? this.filteredResults : this.avis;
  }

  hasActiveFilters(): boolean {
    return !!this.searchQuery;
  }


  paginatedAvis() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAvis().slice(startIndex, startIndex + this.itemsPerPage);
  }

  calculateTotalPages() {
    const totalItems = this.filteredAvis().length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
  }

  firstItemOnPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  lastItemOnPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredAvis().length);
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
    this.newAvis = { 
      clientId:this.storageService.getUserId(),
      description:'',
      note:0,
      servicevehiculeId:this.id,
      statut:'Publie'
    };
  }
  
  openEditModal(avis: any) {
    this.isEditMode = true;
    this.newAvis = { ...avis,
      servicevehiculeId:this.id,
      clientId:this.storageService.getUserId() ,
      statut:'Publie'
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  
  // CRUD Operations
  addAvis(): void {
    this.avisService.createAvis(this.newAvis).subscribe({
      next: () => {
        this.loadAvisClient();
        this.closeModal();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  updateAvis() {
    this.avisService.updateAvis(this.newAvis._id,this.newAvis).subscribe({
      next: () => {
        this.loadAvisClient();
        this.closeModal();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  deleteAvis(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      this.avisService.deleteAvis(id).subscribe({
        next: () => this.loadAvisClient(),
        error: (err) => console.error('Erreur:', err)
      });
    }
  }
}

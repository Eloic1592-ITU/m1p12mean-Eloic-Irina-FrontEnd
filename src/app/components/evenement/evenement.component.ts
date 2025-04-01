import { Component, OnInit } from '@angular/core';
import { EvenementService } from '../../services/evenement/evenement.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { formatDateForInput } from '../../utils/utils';

@Component({
  standalone: true,
  selector: 'app-evenement',
  imports: [CommonModule, FormsModule],
  templateUrl: './evenement.component.html',
  styleUrls: ['./evenement.component.css']
})
export class EvenementComponent implements OnInit {
  searchQuery: string = '';
  dateFilter: string = '';
  evenements: any[] = [];
  filteredResults: any[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  newEvenement: any = { 
    nom: '', 
    description: '', 
    datedebut: '', 
    datefin: '', 
    image: 'default.jpg' 
  };
  selectedFile: File | null = null;

  isModalOpen = false;
  isEditMode = false;

  constructor(private evenementservice: EvenementService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvenement();
  }

  loadEvenement(): void {
    this.evenementservice.getEvenement().subscribe({
      next: (data) => {
        this.evenements = data;
        this.calculateTotalPages();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  // Filtres
  applyFilters() {
    let results = this.evenements;
    
    // Filtre texte
    if (this.searchQuery) {
      results = results.filter(evenement =>
        evenement.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        evenement.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    // Filtre date
    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter);
      results = results.filter(evenement => {
        const eventDate = new Date(evenement.datedebut);
        return eventDate.toDateString() === filterDate.toDateString();
      });
    }
    
    this.filteredResults = results;
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  resetFilters() {
    this.searchQuery = '';
    this.dateFilter = '';
    this.filteredResults = [];
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  hasActiveFilters(): boolean {
    return !!this.searchQuery || !!this.dateFilter;
  }

  // Événements en cours (se déroulant aujourd'hui)
  currentEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.evenements.filter(event => {
      const start = new Date(event.datedebut);
      const end = new Date(event.datefin);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return start <= today && end >= today;
    });
  }

  // Pagination
  filteredEvents() {
    return this.filteredResults.length > 0 ? this.filteredResults : this.evenements;
  }

  paginatedEvents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEvents().slice(startIndex, startIndex + this.itemsPerPage);
  }

  firstItemOnPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  lastItemOnPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredEvents().length);
  }

  calculateTotalPages() {
    const totalItems = this.filteredEvents().length;
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
      this.newEvenement.image = this.selectedFile.name;
    }
  }

  // Gestion des modales
  openAddModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.newEvenement = { 
      nom: '', 
      description: '', 
      datedebut: '', 
      datefin: '', 
      image: 'default.jpg' 
    };
  }

  openEditModal(event: any) {
    this.isEditMode = true;
    this.newEvenement = { 
      ...event,
      datedebut: formatDateForInput(event.datedebut),
      datefin: formatDateForInput(event.datefin) 
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // CRUD Operations
  addEvent(): void {
    this.evenementservice.addEvenement(this.newEvenement)
      .subscribe({
        next: () => {
          this.loadEvenement();
          this.closeModal();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  updateEvent() {
    this.evenementservice.updateEvenement(this.newEvenement._id, this.newEvenement)
      .subscribe({
        next: () => {
          this.loadEvenement();
          this.closeModal();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  promotion(evenementId: string): void {
    this.router.navigate(['/promotion', evenementId]);
  }

  deleteEvent(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.evenementservice.deleteEvenement(id).subscribe({
        next: () => this.loadEvenement(),
        error: (err) => console.error('Erreur:', err)
      });
    }
  }
}
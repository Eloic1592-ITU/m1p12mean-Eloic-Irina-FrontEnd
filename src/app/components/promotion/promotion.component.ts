import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../services/service/service.service';
import { PromotionService } from '../../services/promotion/promotion.service';
import { formatDateForInput } from '../../utils/utils';
import { ImageUtilsService } from '../../services/image/image.service';

@Component({
  standalone: true,
  selector: 'app-promotion',
  imports: [CommonModule, FormsModule],
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
  id: string | null = null;
  searchQuery: string = '';
  dateFilter: string = '';
  promotions: any[] = [];
  filteredResults: any[] = [];
  evenements: any[] = [];
  services: any[] = [];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  newPromotion: any = { 
    nom: '',
    description: '',
    datedebut: '',
    datefin: '',
    evenementId: '',
    serviceId: '',
    reduction: 0,
    codepromo: '',
    conditions: '',
    image: ''
  };
  selectedFile: File | null = null;

  isModalOpen = false;
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private promotionService: PromotionService,
    private serviceService: ServiceService,
    private imageservice: ImageUtilsService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadPromotions(this.id);
    this.loadServices();
  }

  loadPromotions(eventId: any): void {
    this.promotionService.getPromotionsbyEvent(eventId).subscribe({
      next: (data) => {
        this.promotions = data;
        this.calculateTotalPages();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
  loadServices(): void {
    this.serviceService.getService().subscribe({
      next: (data) => this.services = data,
      error: (err) => console.error('Erreur:', err)
    });
  }

  // Filtres
  applyFilters() {
    let results = this.promotions;
    
    // Filtre texte
    if (this.searchQuery) {
      results = results.filter(promo =>
        promo.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        promo.codepromo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        this.getEventName(promo.evenementId).toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        this.getServiceName(promo.serviceId).toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    // Filtre date
    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter);
      results = results.filter(promo => {
        const startDate = new Date(promo.datedebut);
        const endDate = new Date(promo.datefin);
        return filterDate >= startDate && filterDate <= endDate;
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

  // Promotions actives (en cours)
  activePromotions() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.promotions.filter(event => {
      const start = new Date(event.datedebut);
      const end = new Date(event.datefin);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return start <= today && end >= today;
    });
  }

  // Statut des promotions
  getPromoStatus(promo: any): string {
    const today = new Date();
    const start = new Date(promo.datedebut);
    const end = new Date(promo.datefin);
    
    if (start > today) return 'À venir';
    if (end < today) return 'Expirée';
    return 'Active';
  }

  getPromoStatusClass(promo: any): string {
    const status = this.getPromoStatus(promo);
    return {
      'Active': 'status-active',
      'À venir': 'status-upcoming',
      'Expirée': 'status-expired'
    }[status] || '';
  }

  // Pagination
  filteredPromotions() {
    return this.filteredResults.length > 0 ? this.filteredResults : this.promotions;
  }

  paginatedPromotions() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPromotions().slice(startIndex, startIndex + this.itemsPerPage);
  }

  firstItemOnPage(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  lastItemOnPage(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredPromotions().length);
  }

  calculateTotalPages() {
    const totalItems = this.filteredPromotions().length;
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
      this.newPromotion.image = this.selectedFile.name;
    }
  }

  // Gestion des modales
  openAddModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.newPromotion = { 
      nom: '',
      description: '',
      datedebut: '',
      datefin: '',
      evenementId: this.id,
      serviceId: '',
      reduction: 0,
      codepromo: '',
      conditions: '',
      image: ''
    };
  }

  openEditModal(promotion: any) {
    this.isEditMode = true;
    this.newPromotion = { 
      ...promotion,
      evenementId: this.id,
      datedebut: formatDateForInput(promotion.datedebut),
      datefin: formatDateForInput(promotion.datefin)
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // CRUD Operations
  async addPromotion(): Promise<void> {
    if (this.selectedFile) {
      this.newPromotion.image = await this.imageservice.compressImage(this.selectedFile, 800);
    }
    this.promotionService.createPromotion(this.newPromotion).subscribe({
      next: () => {
        this.loadPromotions(this.id);
        this.closeModal();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  async updatePromotion(): Promise<void> {
    if (this.selectedFile) {
      this.newPromotion.image = await this.imageservice.compressImage(this.selectedFile, 800);
    }
    this.promotionService.updatePromotion(this.newPromotion._id, this.newPromotion)
      .subscribe({
        next: () => {
          this.loadPromotions(this.id);
          this.closeModal();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  deletePromotion(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      this.promotionService.deletePromotion(id).subscribe({
        next: () => this.loadPromotions(this.id),
        error: (err) => console.error('Erreur:', err)
      });
    }
  }

  // Helper methods
  getEventName(eventId: string): string {
    if (!eventId) return 'Aucun';
    const event = this.evenements.find(e => e._id === eventId);
    return event ? event.nom : 'Aucun';
  }

  getServiceName(serviceId: string): string {
    if (!serviceId) return 'Aucun';
    const service = this.services.find(s => s._id === serviceId);
    return service ? service.nom : 'Aucun';
  }
}
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServicevehiculeService } from '../../services/servicevehicule/servicevehicule.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-servicesvehicules',
  imports: [FormsModule,CommonModule],
  templateUrl: './servicesvehicules.component.html',
  styleUrl: './servicesvehicules.component.css'
})
export class ServicesvehiculesComponent {
  id: string | null = null;
  servicevehicules: any[]=[];
  totalservice=0;
  sommeprix=0;
  filteredResults: any[] = [];
  startDate: string = '';
  endDate: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private route: ActivatedRoute,
    private servicevehiculeservice: ServicevehiculeService
  ) {}
  
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadServiceVehicule();
  }
  loadServiceVehicule(): void {
    this.servicevehiculeservice.getAllServicevehicule(this.id).subscribe({
      next: (data) => {
        console.log('Données reçues:', data); 
        this.servicevehicules = data.services;
        this.totalservice=data.count;
        this.sommeprix=data.totalPrice;
        this.filteredResults = [...this.servicevehicules];
        this.calculateTotalPages();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
  // Pagination
  calculateTotalPages() {
    const totalItems = this.filteredResults.length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
  }

  paginatedServicehicule() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const sourceArray = this.filteredResults.length > 0 ? this.filteredResults : this.servicevehicules;
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

    // Filtrage
    applyFilter() {
      const defaultStartDate = new Date();
      defaultStartDate.setHours(0, 0, 0, 0);
      
      const defaultEndDate = new Date();
      defaultEndDate.setHours(23, 59, 59, 999);
    
      const searchStart = this.startDate 
        ? new Date(this.startDate)
        : new Date(defaultStartDate);
      searchStart.setHours(0, 0, 0, 0);
    
      const searchEnd = this.endDate 
        ? new Date(this.endDate)
        : new Date(defaultEndDate);
      searchEnd.setHours(23, 59, 59, 999);
    
      if (!this.startDate && this.endDate) {
        searchStart.setFullYear(1970, 0, 1); // Date très ancienne
      }
    
      if (this.startDate && !this.endDate) {
        searchEnd.setFullYear(2100, 0, 1); // Date très lointaine
      }
        this.filteredResults = this.servicevehicules.filter(sv => {
        const dateDebut = new Date(sv.datedebut);
        const dateFin = sv.datefin ? new Date(sv.datefin) : new Date(sv.datedebut);
        
        return (dateDebut >= searchStart && dateDebut <= searchEnd) ||
               (dateFin >= searchStart && dateFin <= searchEnd) ||
               (dateDebut <= searchStart && dateFin >= searchEnd);
      });
    
      this.currentPage = 1;
      this.calculateTotalPages();
    }

}

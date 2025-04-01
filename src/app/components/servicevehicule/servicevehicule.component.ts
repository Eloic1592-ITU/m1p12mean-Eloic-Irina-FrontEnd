import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicevehiculeService } from '../../services/servicevehicule/servicevehicule.service';
import { formatDateForInput } from '../../utils/utils';
import { ServiceService } from '../../services/service/service.service';
import { VehiculeService } from '../../services/vehicule/vehicule.service';

@Component({
  standalone: true,
  selector: 'app-servicevehicule',
  imports: [FormsModule, CommonModule],
  templateUrl: './servicevehicule.component.html',
  styleUrls: ['./servicevehicule.component.css']
})
export class ServicevehiculeComponent implements OnInit {
  id: string | null = null;
  clientId: string |null=null;
  searchQuery: string = '';
  startDate: string = '';
  endDate: string = '';
  
  servicevehicules: any[] = [];
  services:any[]=[];
  filteredResults: any[] = [];
  vehicules : any[]=[];
  newServicevehicule: any = { 
    vehiculeId: '',
    serviceId: '',
    rendezvousId: '',
    datedebut: '',
    datefin: '',
    statut: 'En cours'
  };

  isModalOpen = false;
  isEditMode = false;
  statuts = ['En cours', 'Terminé', 'Annulé'];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private route: ActivatedRoute,
    private servicevehiculeservice: ServicevehiculeService,
    private serviceService: ServiceService,
    private vehiculeService:VehiculeService,
    private router: Router
  ) {}

  ngOnInit(): void { 
    this.id = this.route.snapshot.paramMap.get('id');
    this.clientId = this.route.snapshot.paramMap.get('clientId');
    alert(this.clientId);
    this.loadServiceVehicule();
    this.loadServices();
    this.loadVehicule();
    
  }
  loadServiceVehicule(): void {
    this.servicevehiculeservice.getAllServicerendezvous(this.id).subscribe({
      next: (data) => {
        console.log('Données reçues:', data); 
        this.servicevehicules = data.services;
        this.filteredResults = [...this.servicevehicules];
        this.calculateTotalPages();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  loadVehicule():void{
    this.vehiculeService.getVehiculesClient(this.clientId).subscribe({
      next: (data) => {
        this.vehicules = data;      
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
      searchStart.setFullYear(1970, 0, 1);
    }
  
    if (this.startDate && !this.endDate) {
      searchEnd.setFullYear(2100, 0, 1);
    }

    this.filteredResults = this.servicevehicules.filter(dmd => {
      const dateDebut = new Date(dmd.datedebut);
      const dateFin = dmd.datefin ? new Date(dmd.datefin) : new Date(dmd.datedebut);
      
      return (dateDebut >= searchStart && dateDebut <= searchEnd) ||
             (dateFin >= searchStart && dateFin <= searchEnd) ||
             (dateDebut <= searchStart && dateFin >= searchEnd);
    });
  
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  // Pagination
  calculateTotalPages() {
    const totalItems = this.filteredResults.length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
  }

  paginatedServiceVehicule() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredResults.slice(startIndex, endIndex);
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
    this.newServicevehicule = { 
      vehiculeId: '',
      serviceId: '',
      rendezvousId: this.id || '',
      datedebut: '',
      datefin: '',
      statut: 'En cours'
    };
  }

  openEditModal(servicevehicule: any) {
    this.isEditMode = true;
    this.newServicevehicule = { 
      ...servicevehicule,
      datedebut: formatDateForInput(servicevehicule.datedebut),
      datefin: formatDateForInput(servicevehicule.datefin)
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // CRUD Operations
  addServiceVehicule(): void {
    this.servicevehiculeservice.createServiceVehicule(this.newServicevehicule).subscribe({
      next: () => {
        this.loadServiceVehicule();
        this.closeModal();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  updateServiceVehicule(): void {
    this.servicevehiculeservice.updateServiceVehicule(this.newServicevehicule._id, this.newServicevehicule).subscribe({
      next: () => {
        this.loadServiceVehicule();
        this.closeModal();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  deleteServiceVehicule(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service véhicule ?')) {
      this.servicevehiculeservice.deleteServiceVehicule(id).subscribe({
        next: () => this.loadServiceVehicule(),
        error: (err) => console.error('Erreur:', err)
      });
    }
  }
}
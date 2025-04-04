import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ClientService } from '../../services/client/client.service';
import { Router } from '@angular/router';
import { PromotionService } from '../../services/promotion/promotion.service';
import { ServiceService } from '../../services/service/service.service';
import { AvisService } from '../../services/avis/avis.service';
import { MaintenanceService } from '../../services/maintenance/maintenance.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-accueil',
  // standalone: true,
  template: `
  <app-authenticated-layout [client]="currentUser">
    <!-- Contenu spécifique à la page rendez-vous -->
    <h2>Vos rendez-vous</h2>
    <!-- ... autres éléments ... -->
  </app-authenticated-layout>
`,
  imports: [FormsModule,CommonModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit  {
  client: any = { 
    nom: '',
    datenaissance: '',
    contact: '',
    email: '',
    motdepasse: '',
    image: 'assets/img/defaultavatar.png' 
  };
  servicesvehicules:any[]=[];
  avisclient:any[]=[];
  promotionsactive:any[]=[];
  maintenances:any[]=[];
  servicesconcernees: any[] = [];
  searchQuery: string = '';  
  filteredResults: any[] = [];

  showDropdown = false;
  userName = 'Jean Dupont'; // À remplacer par le vrai nom de l'utilisateur
  currentPage = 1;
  itemsPerPage = 5; // Nombre d'items par page
  pagedServices: any[] = []; // Services à afficher
  totalPages = 1;

  constructor(
    private authService: AuthService,
    private clientservice: ClientService,
    private router: Router,
    private promotionservice: PromotionService,
    private serviceservice:ServiceService,
    private avisservice:AvisService,
    private maintenanceService:MaintenanceService,
    private storageService:StorageService,
  ){}
  ngOnInit(): void {
      this.getName();
      this.loadPromotion();
      this.loadServices();
      this.loadAvis();
      this.loadEntretien();
  }

  getName(): void{
    this.clientservice.getClientById(this.storageService.getUserId()).subscribe({
      next: (data) => {
        console.log('Données reçues:', data); 
        this.client=data;
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  loadPromotion():void {
    this.promotionservice.getAllPromotions().subscribe({
      next: (data) => {
        console.log('Promotions reçues:', data); 
        this.promotionsactive=data;
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  // Promotions actives (en cours)
  activePromotions() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.promotionsactive.filter(event => {
      const start = new Date(event.datedebut);
      const end = new Date(event.datefin);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return start <= today && end >= today;
    });
  }
    getServiceName(serviceId: string): string {
      if (!serviceId) return 'Aucun';
      const service = this.servicesvehicules.find(s => s._id === serviceId);
      return service ? service.nom : 'Aucun';
    }


    loadServices(): void {
      this.serviceservice.getService().subscribe({
        next: (data) => {
          console.log('Données reçues:', data); 
          this.servicesvehicules = data;
          this.updatePagination(); // Met à jour la pagination après chargement
        },
        error: (err) => console.error('Erreur:', err)
      });
    }
     // Filtres
  applyFilters() {
    let results = this.servicesvehicules;
    
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
    this.updatePagination();
  }

  
  // Met à jour les données paginées
  updatePagination(): void {
    // Calcule le nombre total de pages
    this.totalPages = Math.ceil(this.filteredServices().length / this.itemsPerPage);
    
    // S'assure que la page actuelle est valide
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    
    // Filtre les services pour la page actuelle
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedServices = this.filteredServices().slice(startIndex, startIndex + this.itemsPerPage);
  }

    // Pagination
    filteredServices() {
      return this.filteredResults.length > 0 ? this.filteredResults : this.servicesvehicules;
    }

  // Change de page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // Génère les numéros de page à afficher
  getPageNumbers(): number[] {
    const maxVisiblePages = 5; // Nombre max de boutons visibles
    const pages = [];
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  

  loadAvis():void {
    this.avisservice.getAllAvis().subscribe({
      next: (data) => {
        console.log('Données reçues:', data); 
        this.avisclient=data;
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  

  loadEntretien():void {
    this.maintenanceService.getAllMaintenances().subscribe({
      next: (data) => {
        console.log('Maintenances reçues:', data); 
        this.maintenances=data;
      },
      error: (err) => console.error('Erreur:', err)
    });
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
  services(){}

}

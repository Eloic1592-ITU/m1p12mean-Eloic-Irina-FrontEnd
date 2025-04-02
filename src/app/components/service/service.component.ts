import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service/service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// import { compressAccurately } from 'browser-image-compression';


@Component({
  standalone: true,
  selector: 'app-service',
  imports: [CommonModule, FormsModule],
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  searchQuery: string = '';
  priceFilter:  Number = 0;
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
    image: '' 
  };
  imagePreview: string | null = null;

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
      const priceValue = this.priceFilter;
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
    this.priceFilter = 0;
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

  // async onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
    
  //   if (!file) return;
  
  //   // Vérification du type
  //   if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
  //     alert('Seuls les fichiers PNG, JPEG ou JPG sont autorisés !');
  //     return;
  //   }
  
  //   try {
  //     // Compression de l'image
  //     const options = {
  //       maxSizeMB: 1,          // Taille maximale (1MB)
  //       maxWidthOrHeight: 1920, // Résolution maximale
  //       useWebWorker: true     // Pour ne pas bloquer le thread UI
  //     };
      
  //     const compressedFile = await compressAccurately(file, options);
      
  //     // Conversion en Base64
  //     const base64Image = await this.fileToBase64(compressedFile);
      
  //     // Stockage dans l'objet newService
  //     this.newService.image = base64Image;
  //     this.imagePreview = base64Image; // Aperçu
  
  //   } catch (error) {
  //     console.error('Erreur:', error);
  //     alert('Erreur lors du traitement de l\'image');
  //   }
  // }
  
// Fonction utilitaire pour conversion File -> Base64
fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
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

// Méthode d'insertion
addService(): void {
  // Validation simple
  if (!this.newService.nom) {
    alert('Le nom du service est obligatoire');
    return;
  }

  this.serviceService.addService(this.newService)
    .subscribe({
      next: () => {
        alert('Service ajouté avec succès');
        this.loadServices(); // Si vous avez cette méthode
        this.closeModal(); // Si vous travaillez avec une modal
      },
      error: (err) => {
        console.error('Erreur:', err);
      }
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
function compressAccurately(file: File, arg1: {
  size: number; // Taille cible en KB
  accuracy: number;
}): File | PromiseLike<File> {
  throw new Error('Function not implemented.');
}


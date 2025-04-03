import { Component, OnInit } from '@angular/core';
import { FactureService } from '../../services/facture/facture.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facture',
  imports: [FormsModule,CommonModule],
  templateUrl: './facture.component.html',
  styleUrl: './facture.component.css'
})
export class FactureComponent implements OnInit{
  id: string | null = null;
  services: any[] = [];
  totalservice=0;
  sommeinitial=0;
  reduction=0;
  sommefinal=0;
  filteredResults: any[] = [];
  startDate: string = '';
  endDate: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private factureService: FactureService,private route: ActivatedRoute,   private router: Router){}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadservices();

  }

  loadservices(): void {
    this.factureService.getFactureRendezvous(this.id).subscribe({
      next: (data) => {
        console.log('Données reçues:', data); 
        this.services = data.services;
        this.totalservice=data.count;
        this.sommeinitial=data.totals.initial;
        this.reduction=data.totals.reduction;
        this.sommefinal=data.totals.final;
        this.filteredResults = [...this.services];
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

    paginatedServices() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const sourceArray = this.filteredResults.length > 0 ? this.filteredResults : this.services;
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
    printInvoice() {
      this.factureService.printInvoices(this.id).subscribe(
        (response: Blob) => {
          // 1. Créer un blob à partir de la réponse
          const blob = new Blob([response], { type: 'application/pdf' });
          
          // 2. Créer une URL objet
          const url = window.URL.createObjectURL(blob);
          
          // 3. Ouvrir dans un nouvel onglet ou forcer le téléchargement
          window.open(url, '_blank');
          
          // Alternative: Téléchargement automatique
          const a = document.createElement('a');
          a.href = url;
          a.download = `facture-${this.id}.pdf`;
          a.click();
          
          // 4. Nettoyer la mémoire
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Erreur lors de la génération du PDF', error);
          // Gérer l'erreur (message à l'utilisateur, etc.)
        }
      );
    }

    
    avis(serviceVehiculeId: string): void{
      this.router.navigate(['/apercuavis',serviceVehiculeId]);
    }
}

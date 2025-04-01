import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MecanicienService } from '../../services/mecanicien/mecanicien.service';

@Component({
  standalone: true,
  selector: 'app-mecanicien',
  imports: [CommonModule, FormsModule],
  templateUrl: './mecanicien.component.html',
  styleUrls: ['./mecanicien.component.css']
})
export class MecanicienComponent implements OnInit {
  searchQuery: string = '';
  mecaniciens: any[] = [];
  newMecanicien: any = { 
    nom: '',
    datenaissance: '',
    adresse: '',
    contact: '',
    email: '',
    motdepasse: '',
    specialite: '',
    image: 'default.jpg' 
  };
  selectedFile: File | null = null;

  isModalOpen = false;
  isEditMode = false;

  constructor(private mecanicienService: MecanicienService, private router: Router) {}

  ngOnInit(): void {
    this.loadMecaniciens();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  loadMecaniciens(): void {
    this.mecanicienService.getMecanicien().subscribe({
      next: (data) => this.mecaniciens = data,
      error: (err) => console.error('Erreur:', err)
    });
  }

  filteredMecaniciens() {
    if (!this.searchQuery) return this.mecaniciens;
    return this.mecaniciens.filter(mecanicien =>
      mecanicien.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      mecanicien.specialite.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      mecanicien.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Gestion des modales
  openAddModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.newMecanicien = { 
      nom: '',
      datenaissance: '',
      adresse: '',
      contact: '',
      email: '',
      motdepasse: '',
      specialite: '',
      image: 'default.jpg' 
    };
  }

  openEditModal(mecanicien: any) {
    this.isEditMode = true;
    this.newMecanicien = { ...mecanicien };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Opérations CRUD
  addMecanicien(): void {
    this.mecanicienService.addMecanicien(this.newMecanicien).subscribe({
      next: () => {
        this.loadMecaniciens();
        this.closeModal();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  updateMecanicien() {
    this.mecanicienService.updateMecanicien(this.newMecanicien._id, this.newMecanicien)
      .subscribe({
        next: () => {
          this.loadMecaniciens();
          this.closeModal();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  navigateToEdit(mecanicienId: string): void {
    this.router.navigate(['/edit-mecanicien', mecanicienId]);
  }

  deleteMecanicien(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce mécanicien ?')) {
      this.mecanicienService.deleteMecanicien(id).subscribe({
        next: () => this.loadMecaniciens(),
        error: (err) => console.error('Erreur:', err)
      });
    }
  }
}
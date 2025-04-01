import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client/client.service';

@Component({
  standalone: true,
  selector: 'app-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  searchQuery: string = '';
  clients: any[] = [];
  newClient: any = { 
    nom: '',
    datenaissance: '',
    contact: '',
    email: '',
    motdepasse: '',
    image: 'default.jpg' 
  };
  selectedFile: File | null = null;

  isModalOpen = false;
  isEditMode = false;

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit(): void {
    this.loadClients();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Erreur:', err)
    });
  }

  filteredClients() {
    if (!this.searchQuery) return this.clients;
    return this.clients.filter(client =>
      client.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      client.contact.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Gestion des modales
  openAddModal() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.newClient = { 
      nom: '',
      datenaissance: '',
      contact: '',
      email: '',
      motdepasse: '',
      image: 'default.jpg' 
    };
  }

  openEditModal(client: any) {
    this.isEditMode = true;
    this.newClient = { ...client };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Opérations CRUD
  addClient(): void {
    this.clientService.addClient(this.newClient).subscribe({
      next: () => {
        this.loadClients();
        this.closeModal();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  updateClient() {
    this.clientService.updateClient(this.newClient._id, this.newClient)
      .subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  navigateToEdit(clientId: string): void {
    this.router.navigate(['/edit-client', clientId]);
  }

  deleteClient(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => this.loadClients(),
        error: (err) => console.error('Erreur:', err)
      });
    }
  }
}
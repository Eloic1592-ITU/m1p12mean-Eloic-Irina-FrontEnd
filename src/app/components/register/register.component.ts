import { Component } from '@angular/core';
import { ClientService } from '../../services/client/client.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  newClient: any = { 
    nom: '',
    datenaissance: '',
    contact: '',
    email: '',
    motdepasse: '',
    confirmationMotdepasse: '',
    image: 'default.jpg'
  };
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.newClient.image = this.selectedFile.name;
    }
  }

  onSubmit(): void {
    if (this.newClient.motdepasse !== this.newClient.confirmationMotdepasse) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.clientService.addClient(this.newClient).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Inscription réussie! Redirection...';
        setTimeout(() => {
          this.router.navigate(['/loginclient']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || "Erreur lors de l'inscription";
      }
    });
  }

}

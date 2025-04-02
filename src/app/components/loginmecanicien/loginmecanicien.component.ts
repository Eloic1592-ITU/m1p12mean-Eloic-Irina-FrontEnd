import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-loginmecanicien',
  imports: [CommonModule, FormsModule],
  templateUrl: './loginmecanicien.component.html',
  styleUrl: './loginmecanicien.component.css'
})
export class LoginmecanicienComponent {
  credentials = {
    email: 'mecanicien1@gmail.com',
    motdepasse: 'mecanicien1',
  };
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.authService.login(this.credentials,'mecanicien').subscribe(
      (response) => {
        // Connexion réussie
        this.router.navigate(['/rendezvousmecanicien']); 
      },
      (error) => {
        this.errorMessage = 'Email ou mot de passe incorrect';
        console.error('Erreur de connexion', error);
      }
    );
  }
  logout(): void{
    this.authService.logout
  }

  register(): void {
    this.router.navigate(['/register']);
  }
}

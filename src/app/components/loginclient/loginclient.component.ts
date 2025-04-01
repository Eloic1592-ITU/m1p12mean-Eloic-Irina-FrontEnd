import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-loginclient',
  imports: [CommonModule, FormsModule],
  templateUrl: './loginclient.component.html',
  styleUrl: './loginclient.component.css'
})
export class LoginclientComponent {
  credentials = {
    email: '',
    motdepasse: '',
  };

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.authService.login(this.credentials,'client').subscribe(
      (response) => {
        // Connexion réussie
        this.router.navigate(['/rendezvous']); 
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

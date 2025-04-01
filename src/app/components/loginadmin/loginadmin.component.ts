import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-loginadmin',
  imports: [CommonModule, FormsModule],
  templateUrl: './loginadmin.component.html',
  styleUrl: './loginadmin.component.css'
})
export class LoginadminComponent {
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
    this.authService.login(this.credentials,'admin').subscribe(
      (response) => {      
        // alert("Token:"+response.token);
        this.router.navigate(['/validationrendezvous']); 
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

}

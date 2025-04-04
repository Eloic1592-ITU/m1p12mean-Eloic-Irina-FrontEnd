import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../../services/storage/storage.service';
import { AuthService } from '../../../services/auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-authenticated-layout',
  templateUrl: './authenticated-layout.component.html',
  styleUrl: './authenticated-layout.component.css',
  standalone:true,
  imports: [RouterModule,NgIf],
})
export class AuthenticatedLayoutComponent {
  @Input() client: any; // Reçoit les données du client
  @Output() onLogout = new EventEmitter<void>(); // Événement de déconnexion
  @Output() onProfileChange = new EventEmitter<void>(); // Événement changement de profil

  showDropdown = false; // Contrôle l'affichage du menu déroulant

  constructor(private router: Router ,
      private authService: AuthService,
    private storageService:StorageService) {}
  toggleDropdown(): void {
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
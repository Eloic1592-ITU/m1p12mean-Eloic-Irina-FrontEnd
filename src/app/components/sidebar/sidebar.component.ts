import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MenuService } from '../../services/menu/menu.service';
import { NgFor, NgIf } from '@angular/common'; // Import nécessaire
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [NgFor,RouterLink, RouterLinkActive], // Ajoutez NgIf ici
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  showSidebar = true;
  @Output() closeSidebar = new EventEmitter<void>();
  menuItems: any[] = [];

  constructor(
    private authService: AuthService,
    private menuService: MenuService
  ) {
    this.menuItems = this.menuService.getMenuItems();
  }

  onClose() {
    this.closeSidebar.emit();
  }
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
    // Méthode pour vérifier si l'utilisateur est admin (optionnel)
  get isAdmin(): boolean {
    return localStorage.getItem('user_role') === 'admin';
  }

  // Méthode pour vérifier si l'utilisateur est mécanicien (optionnel)
  get isMecanicien(): boolean {
    return localStorage.getItem('user_role') === 'mecanicien';
  }

  logout():void{
    this.authService.logout();
  }

  get userRole(): string | null {
    return localStorage.getItem('user_role');
  }
  
  get userRoleLabel(): string {
    switch(this.userRole) {
      case 'admin': return 'Administrateur';
      case 'mecanicien': return 'Mécanicien';
      default: return '';
    }
  }

}

import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  userRole: string = 'mecanicien'; // Simuler un rôle de mécanicien pour l'exemple

  // Logiciel pour afficher/masquer les liens en fonction du rôle
  isMecanicien(): boolean {
    return this.userRole === 'mecanicien';
  }
}

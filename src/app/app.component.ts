import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, SidebarComponent, NgIf],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Garage';
  showSidebar = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Masquer la sidebar pour les routes spécifiques
        this.showSidebar = !this.shouldHideSidebar(event.url);
      });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  private shouldHideSidebar(url: string): boolean {
    const hiddenRoutes = [
      '/loginadmin', 
      '/loginclient', 
      '/loginmecanicien',
      '/register',
      '/connexion'
    ];

    // Cas spécial pour la racine
    if (url === '/' || url === '/?') {
      return false; // On montre la sidebar sur la page d'accueil
    }

    // Vérification exacte des routes
    return hiddenRoutes.some(route => 
      url === route || 
      url.startsWith(route + '/') ||
      url === route + '?' ||
      url.startsWith(route + '?')
    );
  }
}
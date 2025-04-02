import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet,SidebarComponent,NgIf ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Garage';
  showSidebar = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Masquer la sidebar pour les routes de login
        this.showSidebar = !['/loginadmin', '/loginclient', '/loginmecanicien','/register','/connexion']
          .some(route => event.url.includes(route));
      });
  }
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
}

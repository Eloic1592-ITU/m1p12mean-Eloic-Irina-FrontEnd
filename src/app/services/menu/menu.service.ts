import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  getMenuItems(): any[] {
    const userRole = localStorage.getItem('user_role');
    

    // Menu spécifique pour l'admin
    const adminMenu = [
      { 
        path: 'dashboard', 
        title: 'Tableau de bord', 
        icon: 'fas fa-tachometer-alt',
        roles: ['admin', 'mecanicien']
      },
      { 
        path: 'validationrendezvous', 
        title: 'Validation Rendez-vous', 
        icon: 'fas fa-calendar-check',
        roles: ['admin']
      },
      { 
        path: 'validationdemande', 
        title: 'Validation Congé', 
        icon: 'fas fa-sun',
        roles: ['admin']
      },
      { 
        path: 'service', 
        title: 'Gestion Services', 
        icon: 'fas fa-wrench',
        roles: ['admin']
      },
      { 
        path: 'evenement', 
        title: 'Événements', 
        icon: 'fas fa-calendar-alt',
        roles: ['admin']
      }
    ];

    // Menu spécifique pour le mécanicien
    const mecanicienMenu = [
      { 
        path: 'rendezvousmecanicien', 
        title: 'Rendez-vous', 
        icon: 'fas fa-calendar-day',
        roles: ['mecanicien']
      },
      { 
        path: 'demande', 
        title: 'Demande Congé', 
        icon: 'fas fa-sun',
        roles: ['mecanicien']
      }
    ];

    // Fusionner les menus en fonction du rôle
    return [
      ...(userRole === 'admin' ? adminMenu : []),
      ...(userRole === 'mecanicien' ? mecanicienMenu : [])
    ].filter(item => item.roles.includes(userRole as string));
  }
}
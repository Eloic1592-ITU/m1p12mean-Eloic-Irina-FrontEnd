import { Routes } from '@angular/router';
import { ServiceComponent } from './components/service/service.component';
import { EvenementComponent } from './components/evenement/evenement.component';
import { MecanicienComponent } from './components/mecanicien/mecanicien.component';
import { EditmecanicienComponent } from './components/editmecanicien/editmecanicien.component';
import { ClientComponent } from './components/client/client.component';
import { EditClientComponent } from './components/edit-client/edit-client.component';
import { RendezvousComponent } from './components/rendezvous/rendezvous.component';
import { PromotionComponent } from './components/promotion/promotion.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { LoginadminComponent } from './components/loginadmin/loginadmin.component';
import { LoginclientComponent } from './components/loginclient/loginclient.component';
import { RoleGuard } from './core/guards/role.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { RegisterComponent } from './components/register/register.component';
import { VehiculeComponent } from './components/vehicule/vehicule.component';
import { AvisComponent } from './components/avis/avis.component';
import { DemandeComponent } from './components/demande/demande.component';
import { FactureComponent } from './components/facture/facture.component';
import { ServicevehiculeComponent } from './components/servicevehicule/servicevehicule.component';
import { LoginmecanicienComponent } from './components/loginmecanicien/loginmecanicien.component';
import { ValidationrendezvousComponent } from './components/validationrendezvous/validationrendezvous.component';
import { ValidationdemandeComponent } from './components/validationdemande/validationdemande.component';
import { RendezvousmecanicienComponent } from './components/rendezvousmecanicien/rendezvousmecanicien.component';
import { DetailservicevehiculeComponent } from './components/detailservicevehicule/detailservicevehicule.component';
import { ServicesvehiculesComponent } from './components/servicesvehicules/servicesvehicules.component';
import { ApercuavisComponent } from './components/apercuavis/apercuavis/apercuavis.component';
import { TableaubordComponent } from './components/tableaubord/tableaubord.component';

export const routes: Routes = [ 
    // Redirection par défaut
    { path: '', redirectTo: 'loginadmin', pathMatch: 'full' },

    { path: 'loginadmin', component: LoginadminComponent },

    { path: 'loginclient', component: LoginclientComponent },

    { path: 'loginmecanicien', component: LoginmecanicienComponent },

    { path: 'register', component: RegisterComponent },

    { path: 'connexion', component: LoginclientComponent },
    
    { path: 'service', component: ServiceComponent,  },      
        // canActivate: [AuthGuard, RoleGuard],
        // data: { roles: ['admin'] }}, 

    { path: 'evenement', component: EvenementComponent },

    { path: 'mecanicien', component: MecanicienComponent },

    { path: 'client', component: ClientComponent },

    { path: 'rendezvous', 
        component: RendezvousComponent, 
        // canActivate: [AuthGuard, RoleGuard],
        // data: { roles: ['client'] }
    }, 
    { path: 'validationrendezvous', 
        component: ValidationrendezvousComponent, 
        // canActivate: [AuthGuard, RoleGuard],
        // data: { roles: ['admin'] }
    }, 
    { path: 'validationdemande', 
        component: ValidationdemandeComponent, 
        // canActivate: [AuthGuard, RoleGuard],
        // data: { roles: ['admin'] }
    }, 

    { path: 'rendezvousmecanicien', 
        component: RendezvousmecanicienComponent, 
        // canActivate: [AuthGuard, RoleGuard],
        // data: { roles: ['mecanicien'] }
    }, 
    
    { path: 'servicevehicule/:id/:clientId', component: ServicevehiculeComponent },

    { path: 'detailservicevehicule/:id', component: DetailservicevehiculeComponent },

    { path: 'servicevehicule/:id', component: ServicesvehiculesComponent },

    { path: 'vehicule', component: VehiculeComponent },

    { path: 'avis/:id', component: AvisComponent },

    { path: 'apercuavis/:id', component: ApercuavisComponent },

    { path: 'demande', component: DemandeComponent },

    { path: 'facture/:id', component: FactureComponent },

    { path: 'rendezvous/facture-pdf/:id', component: FactureComponent },

    { path: 'promotion/:id', component: PromotionComponent },

    { path: 'maintenance/:id', component: MaintenanceComponent }, 

    { path: 'dashboard', component: TableaubordComponent },
        
    { path: 'edit-mecanicien/:id', component: EditmecanicienComponent }, 
    
    { path: 'edit-client/:id', component: EditClientComponent }, 
    
      // Page non autorisée
  { path: 'unauthorized', component: UnauthorizedComponent },
 ];

    


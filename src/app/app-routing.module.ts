import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginclientComponent } from './components/loginclient/loginclient.component';
import { ValidationrendezvousComponent } from './components/validationrendezvous/validationrendezvous.component';
import { ServiceComponent } from './components/service/service.component';
import { ValidationdemandeComponent } from './components/validationdemande/validationdemande.component';
import { EvenementComponent } from './components/evenement/evenement.component';
import { AuthenticatedLayoutComponent } from './components/shared/authenticated-layout/authenticated-layout.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { VehiculeComponent } from './components/vehicule/vehicule.component';
import { ServiceClientComponent } from './components/service-client/service-client.component';




const routes: Routes = [

{ path: 'validationrendezvous', component: ValidationrendezvousComponent },
{ path: 'service', component: ServiceComponent },
{ path: 'validationdemande', component: ValidationdemandeComponent },
{ path: 'evenement', component: EvenementComponent },
  { 
    path: '',
    component: AuthenticatedLayoutComponent,
    children: [
      { path: 'accueil', component: AccueilComponent },
      { path: 'vehicule', component: VehiculeComponent },
      { path: 'serviceclient', component: ServiceClientComponent },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

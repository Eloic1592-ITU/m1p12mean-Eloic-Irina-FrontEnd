import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginclientComponent } from './components/loginclient/loginclient.component';
import { ValidationrendezvousComponent } from './components/validationrendezvous/validationrendezvous.component';
import { ServiceComponent } from './components/service/service.component';
import { ValidationdemandeComponent } from './components/validationdemande/validationdemande.component';
import { EvenementComponent } from './components/evenement/evenement.component';




const routes: Routes = [

{ path: 'validationrendezvous', component: ValidationrendezvousComponent },
{ path: 'service', component: ServiceComponent },
{ path: 'validationdemande', component: ValidationdemandeComponent },
{ path: 'evenement', component: EvenementComponent },
// { path: 'dashboard', component: EvenementComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

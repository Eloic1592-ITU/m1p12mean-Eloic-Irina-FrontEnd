import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ServiceComponent } from './service/service.component';
import { MecanicienComponent } from './mecanicien/mecanicien.component';
import { CongeComponent } from './conge/conge.component';
import { ListeServiceComponent } from './liste-service/liste-service.component';
import { EvenementComponent } from './evenement/evenement.component';
import { PromotionComponent } from './promotion/promotion.component';
import { PlanningComponent } from './planning/planning.component';
import { RendezvousComponent } from './rendezvous/rendezvous.component';
import { TableaubordComponent } from './tableaubord/tableaubord.component';
import { PrendrdvComponent } from './prendrdv/prendrdv.component';
import { OffresComponent } from './offres/offres.component';
import { ConseilTechComponent } from './conseil-tech/conseil-tech.component';
import { EntretienComponent } from './entretien/entretien.component';

import { FormsModule } from '@angular/forms';
import { DevisComponent } from './devis/devis.component';
import { ProfitComponent } from './profit/profit.component'; // Importez FormsModule
import { FullCalendarModule } from '@fullcalendar/angular';  // Importer FullCalendarModule






@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ServiceComponent,
    MecanicienComponent,
    CongeComponent,
    ListeServiceComponent,
    EvenementComponent,
    PromotionComponent,
    PlanningComponent,
    RendezvousComponent,
    TableaubordComponent,
    PrendrdvComponent,
    OffresComponent,
    ConseilTechComponent,
    EntretienComponent,
    DevisComponent,
    ProfitComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

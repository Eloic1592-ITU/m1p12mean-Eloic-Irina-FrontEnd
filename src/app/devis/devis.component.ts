import { Component } from '@angular/core';

@Component({
  selector: 'app-devis',
  standalone: false,
  templateUrl: './devis.component.html',
  styleUrl: './devis.component.css'
})
export class DevisComponent {
 // Exemple de données pour un client
 clientName: string = 'John Doe';

 // Liste des services inclus dans le devis
 services = [
   {
     name: 'Service1',
     description: 'Description du service 1',
     price: 5000,
     promotion: 10,
     discount: 500
   },
   {
     name: 'Service2',
     description: 'Description du service 2',
     price: 3000,
     promotion: 5,
     discount: 200
   },
   {
     name: 'Service3',
     description: 'Description du service 3',
     price: 4500,
     promotion: 15,
     discount: 400
   }
 ];

 // Fonction pour calculer le total d'un service après réduction et promotion
 calculateTotal(price: number, promotion: number, discount: number): number {
   const priceAfterPromotion = price - (price * (promotion / 100)); // Appliquer la promotion
   const finalPrice = priceAfterPromotion - discount; // Appliquer la réduction
   return finalPrice;
 }

 // Fonction pour calculer le total global
 calculateTotalGlobal(): number {
   return this.services.reduce((total, service) => {
     return total + this.calculateTotal(service.price, service.promotion, service.discount);
   }, 0);
 }

 // Fonction pour calculer le total des réductions
 calculateTotalReduction(): number {
   return this.services.reduce((total, service) => {
     return total + service.discount;
   }, 0);
 }

 // Fonction pour envoyer le devis (fonction à implémenter selon votre logique d'envoi)
 sendQuote(): void {
   alert('Le devis a été envoyé au client.');
   // Implémentation de l'envoi du devis (email, PDF, etc.)
 }
}

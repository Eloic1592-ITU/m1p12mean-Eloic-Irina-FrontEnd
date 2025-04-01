import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServicevehiculeService {
  private apiUrl = `${environment.apiUrl}/servicevehicule`; // URL de base pour les services véhicules

  constructor(private http: HttpClient) { }

  // Récupérer tous les services véhicule
  getAllServiceVehicules(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Récupérer tous les services du rendez-vous
  getAllServicerendezvous(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/rendezvous/services/${id}`);
  }

  // Récupérer tous les services véhicule
  getAllServicevehicule(vehiculeId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/rendezvous/services/vehicule/${vehiculeId}`);
  }
  

  // Ajouter un nouveau service véhicule
  createServiceVehicule(serviceVehicule: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, serviceVehicule);
  }

  // Récupérer un service véhicule par son ID
  getServiceVehiculeById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/find/${id}`);
  }

  // Mettre à jour un service véhicule
  updateServiceVehicule(id: string, serviceVehicule: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, serviceVehicule);
  }

  // Supprimer un service véhicule
  deleteServiceVehicule(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Méthodes spécifiques aux services véhicule
  getServicesByVehicule(vehiculeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-vehicule/${vehiculeId}`);
  }

  getServicesByType(type: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-type/${type}`);
  }

  // Méthode pour marquer un service comme terminé
  completeService(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/complete/${id}`, {});
  }

  // Méthode pour obtenir les services en cours
  getPendingServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending`);
  }
}
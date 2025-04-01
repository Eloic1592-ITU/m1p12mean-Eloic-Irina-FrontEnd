import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = `${environment.apiUrl}/vehicule`; // URL de base pour les véhicules

  constructor(private http: HttpClient) { }

  // Récupérer tous les véhicules
  getAllVehicules(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Récupérer tous les véhicules d'un client
  getVehiculesClient(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/${id}`);
  }
  // Ajouter un nouveau véhicule
  addVehicule(vehicule: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, vehicule);
  }

  // Récupérer un véhicule par son ID
  getVehiculeById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/find/${id}`);
  }

  // Mettre à jour un véhicule
  updateVehicule(id: string, vehicule: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, vehicule);
  }

  // Supprimer un véhicule
  deleteVehicule(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Méthodes supplémentaires spécifiques aux véhicules
  getVehiculesByType(type: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-type/${type}`);
  }

  getAvailableVehicules(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available`);
  }
}
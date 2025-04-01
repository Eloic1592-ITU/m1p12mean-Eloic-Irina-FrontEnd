import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private apiUrl = `${environment.apiUrl}/avis`; // URL de base pour les avis

  constructor(private http: HttpClient) { }

  // Récupérer tous les avis
  getAllAvis(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Avis d'un service effectue
  getAvisServiceVehicule(serviceVehiculeId :any): Observable<any> {
    return this.http.get(`${this.apiUrl}/avis/${serviceVehiculeId}`);
  }


  // Créer un nouvel avis
  createAvis(avis: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, avis);
  }

  // Récupérer un avis par son ID
  getAvisById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/find/${id}`);
  }

  // Mettre à jour un avis
  updateAvis(id: string, avis: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, avis);
  }

  // Supprimer un avis
  deleteAvis(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Méthodes spécifiques aux avis
  getAvisByClient(clientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-client/${clientId}`);
  }

  getAvisByService(serviceId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-service/${serviceId}`);
  }

  // Méthode pour obtenir les avis validés
  getValidatedAvis(): Observable<any> {
    return this.http.get(`${this.apiUrl}/validated`);
  }

  // Méthode pour valider un avis
  validateAvis(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/validate/${id}`, {});
  }
}
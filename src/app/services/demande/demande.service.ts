import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private apiUrl = `${environment.apiUrl}/demande`; // URL de base pour les demandes

  constructor(private http: HttpClient) { }

  // Récupérer toutes les demandes
  getAllDemandes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getDemandeMecanicien(): Observable<any> {
    return this.http.get(`${this.apiUrl}/demande/mecanicien`);
  }

  getDemande(mecanicienId:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/demande/mecanicien`);
  }

  // Créer une nouvelle demande
  createDemande(demande: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, demande);
  }

  // Récupérer une demande par son ID
  getDemandeById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/find/${id}`);
  }

  // Mettre à jour une demande
  updateDemande(id: string, demande: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, demande);
  }

  // Supprimer une demande
  deleteDemande(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Méthodes spécifiques aux demandes
  getDemandesByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-status/${status}`);
  }

  getDemandesByClient(clientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-client/${clientId}`);
  }

  // Valider une demande
  validateDemande(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/validate/${id}`, {});
  }

  // Rejeter une demande
  rejectDemande(id: string, reason: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reject/${id}`, { reason });
  }
}
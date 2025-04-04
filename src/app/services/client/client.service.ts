import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/client`; // Utilisation de la variable d'environnement

  constructor(private http: HttpClient) {}

  getClients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getClientRetention(): Observable<any> {
    return this.http.get(`${this.apiUrl}/client-retention`);
  }

  addClient(client: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, client);
  }

  // Récupérer un client par son ID
  getClientById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/find/${id}`);
  }

  updateClient(id: any, client: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, client);
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
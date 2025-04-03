import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {
  private apiUrl = `${environment.apiUrl}/rendezvous`; // Utilisation de la variable d'environnement

  constructor(private http: HttpClient) { }

  getRendezvous(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/rendezvous/client/${id}`);
  }

  getRecentRendezvous(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/${id}`);
  }

  getConfirmedRendezvous(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rendezvous/client`);
  }

  
  getValidatedRendezvous(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rendezvous/valide`);
  }

  addRendezvous(rendezvous: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, rendezvous);
  }

  getRendezvousById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/find/${id}`);
  }

  updateRendezvous(id: string, rendezvous: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, rendezvous);
  }

  deleteRendezvous(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getClientRendezvous(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/${id}`);
  }
  getRendezvousStat(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }


}
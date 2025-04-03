import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/service`;// Utilisation de la variable d’environnement
  constructor(private http: HttpClient) {}

    getService(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
    }
    addService(service: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, service);
    }

    // Récupérer un utilisateur par son ID
    getServicebyId(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/find/${id}`);
    }


    updateService(id: string, service: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, service);
    }
    deleteService(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
    }

    getServicePopular(): Observable<any> {
      return this.http.get(`${this.apiUrl}/services/popular`);
    }
    getRevenueWeekly(): Observable<any> {
      return this.http.get(`${this.apiUrl}/revenue/weekly`);
    }
    getInterventionStat(): Observable<any> {
      return this.http.get(`${this.apiUrl}/intervention-stats`);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private apiUrl = `${environment.apiUrl}/maintenance`; // URL de base pour les maintenances

  constructor(private http: HttpClient) { }

  getAllMaintenances(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getMaintenancesbyService(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/service/maintenance/${id}`);
  }


  createMaintenance(maintenance: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, maintenance);
  }

  getMaintenanceById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/find/${id}`);
  }

  updateMaintenance(id: string, maintenance: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, maintenance);
  }

  deleteMaintenance(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Méthode supplémentaire pour les maintenances à venir
  getUpcomingMaintenances(): Observable<any> {
    return this.http.get(`${this.apiUrl}/upcoming`);
  }
}
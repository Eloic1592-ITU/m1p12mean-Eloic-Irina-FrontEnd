import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private apiUrl = `${environment.apiUrl}/evenement`;// Utilisation de la variable d’environnement
  constructor(private http: HttpClient) {}

  
    getEvenement(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
    }
    addEvenement(evenement: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, evenement);
    }
    // Récupérer un utilisateur par son ID
    getEvenementbyId(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/find/${id}`);
    }

    updateEvenement(id: string, evenement: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, evenement);
    }
    deleteEvenement(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
    }
}

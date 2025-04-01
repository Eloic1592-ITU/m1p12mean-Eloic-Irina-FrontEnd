import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class MecanicienService {
  private apiUrl = `${environment.apiUrl}/mecanicien`;

  constructor(private http: HttpClient) {}

  getMecanicien(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
    }
    addMecanicien(mecanicien: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, mecanicien);
    }
    // Récupérer un utilisateur par son ID
    getMecanicienbyId(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/find/${id}`);
    }


    updateMecanicien(id: string, mecanicien: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, mecanicien);
    }
    deleteMecanicien(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
    }
}

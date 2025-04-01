import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = `${environment.apiUrl}/promotion`; // URL de base pour les promotions

  constructor(private http: HttpClient) { }

  getAllPromotions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getPromotionsbyEvent(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/evenement/promotions/${id}`);
  }
  createPromotion(promotion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, promotion);
  }
  

  getPromotionById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/find/${id}`);
  }

  updatePromotion(id: string, promotion: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, promotion);
  }

  deletePromotion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Méthode supplémentaire possible pour activer/désactiver une promotion
  togglePromotionStatus(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/toggle-status/${id}`, {});
  }
}
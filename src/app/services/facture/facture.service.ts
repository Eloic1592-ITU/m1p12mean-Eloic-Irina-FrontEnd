import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = `${environment.apiUrl}/facture`; // URL de base pour les maintenances


  constructor(private http: HttpClient) { }

  
    getFactureRendezvous(id: any): Observable<any> {
      return this.http.get(`${this.apiUrl}/rendezvous/services/${id}`);
    }

    printInvoices(id: any): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/rendezvous/facture-pdf/${id}`,{
         responseType: 'blob'
      });
    }
  
}

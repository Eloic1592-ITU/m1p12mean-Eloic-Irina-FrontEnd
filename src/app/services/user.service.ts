import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
@Injectable({
  providedIn: 'root'
})
export class UserService {
 private apiUrl = `${environment.apiUrl}/user`;// Utilisation de la variable d’environnement

   constructor(private http: HttpClient) {}

   getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
   }

   addUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl,user);
   }

    // Récupérer un utilisateur par son ID
    getUserById(id: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/${id}`);
  }

    // Mettre à jour un utilisateur
    updateUser(id: string, user: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}`, user);
  }
  deleteUser(id:string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formmodel } from '../model/formModel';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  getSecureData() {
    throw new Error('Method not implemented.');
  }
  router: any;

  constructor(private http: HttpClient) { }

  apiurl = 'http://localhost:3000/users'; // URL de json-server
  apiurlForm = 'http://localhost:3000/data'; // URL de json-server
  api = 'http://localhost:2023/bankbpm/api/credit/save-dynamic-workflow';


  /*saveDynamicWorkflow(data: any): Observable<any> {
    return this.http.post(`${this.api}/api/credit/save-dynamic-workflow`, data);
  }*/
  sendData(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.api, data, { headers });
  }


  // Récupérer tous les utilisateurs
  getAlluser(): Observable<any> {
    return this.http.get(this.apiurl);
  }

   // Récupérer tous les utilisateurs
   getForm(): Observable<any> {
    return this.http.get(this.apiurl);
  }


  // Sauvegarder un nouvel utilisateur
  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiurl, userData);
  }


  // Mettre à jour un utilisateur existant
  updateUser(userId: number, userData: any): Observable<any> {
    const url = `${this.apiurl}/${userId}`;
    return this.http.put(url, userData);
  }

  // Supprimer un utilisateur
  deleteUser(userId: number): Observable<any> {
    const url = `${this.apiurl}/${userId}`;
    return this.http.delete(url);
  }
  getUserById(userId: any) {
    return this.http.get(`${this.apiurl}/${userId}`);
  }
  editUser(user: any) {
    // La redirection vers la route /edit-user/:id
    this.router.navigate(['/edit-user', user.id]);
  }
  private getHeaders() {
    const token = localStorage.getItem('token'); // Récupérer le token JWT
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Exemple de requête GET avec le token JWT
  getData() {
    return this.http.get(`${this.apiurl}/data`, { headers: this.getHeaders() });
  }

  // Exemple de requête POST avec le token JWT
  postData(data: any) {
    return this.http.post(`${this.apiurl}/data`, data, { headers: this.getHeaders() });
  }

}

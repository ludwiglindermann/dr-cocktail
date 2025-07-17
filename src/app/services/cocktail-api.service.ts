import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CocktailApiService {
  private apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

  constructor(private http: HttpClient) {}

  buscarCocteles(nombre: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + nombre);
  }
}

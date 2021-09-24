import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { City } from '../models';
import { Page } from '../models/page.dto';

@Injectable({
  providedIn: 'root'
})
export class HttpCityService {
  controlerPrefix = 'cities';

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<City[]>(`${environment.baseHttpURL}/${this.controlerPrefix}`)
  }

  getByPage(page:number, size: number) {
    return this.httpClient.get<Page<City[]>>(`${environment.baseHttpURL}/${this.controlerPrefix}/page?page=${page}&size=${size}`)
  }

  getById(postalCode: number) {
    return this.httpClient.get<City>(`${environment.baseHttpURL}/${this.controlerPrefix}/${postalCode}`)
  }

  insertCity(city: City) {
    return this.httpClient.post<City>(`${environment.baseHttpURL}/${this.controlerPrefix}`, city)
  }

  updateCity(city: City) {
    return this.httpClient.put<City>(`${environment.baseHttpURL}/${this.controlerPrefix}/${city.postalCode}`, city)
  }

  deleteCity(city: City) {
    // NAPOMENA: Ukoliko rest servis vraca nesto sto nije objekat kao sto je ovde string morate da prosledite responseType: 'text'.
    // U suprotnom nece moci da radi jer ce pokusati da parsira ono body odgovora smatrajuci da je JSON objekat
    return this.httpClient
    .delete(`${environment.baseHttpURL}/${this.controlerPrefix}/${city.postalCode}`, {responseType: 'text'})

  }
}

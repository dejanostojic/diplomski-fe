import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Admin, AdminSearchCriteria } from '../models';
import { Page } from '../models/page.dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  controlerPrefix = 'admins';
  adminsList: Admin[] = [
    {firstName: "first 1", lastName: "last 1", username:"u1", id: 1 },
    {firstName: "first 2", lastName: "last 2", username:"u2", id: 2 },
    {firstName: "first 3", lastName: "last 3", username:"u3", id: 3 },
    {firstName: "first 4", lastName: "last 4", username:"u4", id: 4 },
    {firstName: "first 5", lastName: "last 5", username:"u5", id: 5 },
    {firstName: "first 6", lastName: "last 6", username:"u6", id: 6 }

  ];

  constructor(private httpClient: HttpClient) { }



  getAll() {
    return this.adminsList;
  }

  getByPage(page:number, size: number, searchCriteria: AdminSearchCriteria): Observable<Page<Admin[]>> {
    let filter = searchCriteria.firstName  ? `&firstName=${searchCriteria?.firstName}` : ""; 
    filter += searchCriteria.lastName ? `&lastName=${searchCriteria?.lastName}` : "";
    filter += searchCriteria.username ? `&username=${searchCriteria?.username}` : "";
    return this.httpClient.get<Page<Admin[]>>(`${environment.baseHttpURL}/${this.controlerPrefix}?pageNumber=${page}&pageSize=${size}${filter}`);
  /*  console.log("page " + page + ", size: " + size);
    console.log("page " + page + ", size: " + size);
    return {content : this.adminsList.slice(page  * size, (page + 1)  * size),
      number: page,
       size: size,
        totalElements: this.adminsList.length};*/
  }

  getById(id: number): Observable<Admin> {
    return this.httpClient.get<Admin>(`${environment.baseHttpURL}/${this.controlerPrefix}/${id}`)
    /*return new Observable((observer) => {
      
      let c = this.adminsList.find(c => c.id === id);
      console.log("found: " + c)
      if (c){
        observer.next(c)
      } else{
        observer.error('Admin not found');
      }
    });*/
  }

  insertAdmin(admin: Admin): Observable<Admin> {
    return this.httpClient.post<Admin>(`${environment.baseHttpURL}/${this.controlerPrefix}`, admin)
/*    console.log("inserting: " + JSON.stringify(admin));
    return new Observable((observer) => {
      

      let max = this.adminsList.map(c => c.id).reduce((p, c) => p > c ? p : c);
      console.log("maxId: " + max)
      admin.id = max + 1;
      this.adminsList.push(admin);
      console.log("inserting: " + JSON.stringify(admin));
      console.log("cl: " + JSON.stringify(this.adminsList));
      observer.next(admin);

    });*/
  }

  updateAdmin(admin: Admin) : Observable<Admin>{
    return this.httpClient.put<Admin>(`${environment.baseHttpURL}/${this.controlerPrefix}/${admin.id}`, admin)
    /*console.log("update admin: " + JSON.stringify(admin));
    let c = this.adminsList.find(c => c.id === admin.id);
    console.log("found: " + JSON.stringify(c))
    if (c){

      let index = this.adminsList.indexOf(c)
      this.adminsList.splice(index, 1, admin);
      console.log("cl: " + JSON.stringify(this.adminsList));

    }

    return new Observable((observer) => {

    });*/

  }

  deleteAdmin(admin: Admin) : Observable<string> {
    // NAPOMENA: Ukoliko rest servis vraca nesto sto nije objekat kao sto je ovde string morate da prosledite responseType: 'text'.
    // U suprotnom nece moci da radi jer ce pokusati da parsira ono body odgovora smatrajuci da je JSON objekat
    return this.httpClient.delete(`${environment.baseHttpURL}/${this.controlerPrefix}/${admin.id}`, {responseType: 'text'});
    
/*
    return new Observable((observer) => {
      console.log('searching for ' +  JSON.stringify(admin));
      let c = this.adminsList.find(c => c.id === admin.id);
      console.log("found: " + c)
      if (c){
        let index = this.adminsList.indexOf(c)
        this.adminsList.splice(index, 1);
        observer.next(c)
      } else{
        observer.error('Admin not found');
      }
    });
*/
  }
}

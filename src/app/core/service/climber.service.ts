import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Climber, ClimberSearchCriteria } from '../models';
import { Page } from '../models/page.dto';

@Injectable({
  providedIn: 'root'
})
export class ClimberService {
  controlerPrefix = 'climbers';
  climbersList: Climber[] = [
    {firstName: "first 1", lastName: "last 1", yearOfBirth: 1990, id: 1 },
    {firstName: "first 2", lastName: "last 2", yearOfBirth: 1991, id: 2 },
    {firstName: "first 3", lastName: "last 3", yearOfBirth: 1992, id: 3 },
    {firstName: "first 4", lastName: "last 4", yearOfBirth: 1993, id: 4 },
    {firstName: "first 5", lastName: "last 5", yearOfBirth: 1994, id: 5 },
    {firstName: "first 6", lastName: "last 6", yearOfBirth: 1995, id: 6 }

  ];

  constructor(private httpClient: HttpClient) { }



  getAll() {
    // return this.httpClient.get<Climber[]>(`${environment.baseHttpURL}/${this.controlerPrefix}`)
    return this.climbersList;
  }

  getByPage(page:number, size: number, searchCriteria: ClimberSearchCriteria): Observable<Page<Climber[]>> {
    // return this.httpClient.get<Page<Climber[]>>(`${environment.baseHttpURL}/${this.controlerPrefix}/page?page=${page}&size=${size}`)
// &firstName=${searchCriteria?.firstName}&lastName=${searchCriteria?.lastName}&yearOfBirth=${searchCriteria?.yearOfBirth}
    let filter = searchCriteria.firstName  ? `&firstName=${searchCriteria?.firstName}` : ""; 
    filter += searchCriteria.lastName ? `&lastName=${searchCriteria?.lastName}` : "";
    filter += searchCriteria.yearOfBirth  ? `&yearOfBirth=${searchCriteria?.yearOfBirth}` : "";
    let c =  searchCriteria.yearOfBirth  ? `&yearOfBirth=${searchCriteria?.yearOfBirth}` : "" ;
    console.log("YB SERVICE: " + c)
    return this.httpClient.get<Page<Climber[]>>(`${environment.baseHttpURL}/${this.controlerPrefix}?pageNumber=${page}&pageSize=${size}${filter}`);
  /*  console.log("page " + page + ", size: " + size);
    console.log("page " + page + ", size: " + size);
    return {content : this.climbersList.slice(page  * size, (page + 1)  * size),
      number: page,
       size: size,
        totalElements: this.climbersList.length};*/
  }

  getById(id: number): Observable<Climber> {
    return this.httpClient.get<Climber>(`${environment.baseHttpURL}/${this.controlerPrefix}/${id}`)
    /*return new Observable((observer) => {
      
      let c = this.climbersList.find(c => c.id === id);
      console.log("found: " + c)
      if (c){
        observer.next(c)
      } else{
        observer.error('Climber not found');
      }
    });*/
  }

  insertClimber(climber: Climber): Observable<Climber> {
    return this.httpClient.post<Climber>(`${environment.baseHttpURL}/${this.controlerPrefix}`, climber)
/*    console.log("inserting: " + JSON.stringify(climber));
    return new Observable((observer) => {
      

      let max = this.climbersList.map(c => c.id).reduce((p, c) => p > c ? p : c);
      console.log("maxId: " + max)
      climber.id = max + 1;
      this.climbersList.push(climber);
      console.log("inserting: " + JSON.stringify(climber));
      console.log("cl: " + JSON.stringify(this.climbersList));
      observer.next(climber);

    });*/
  }

  updateClimber(climber: Climber) : Observable<Climber>{
    return this.httpClient.put<Climber>(`${environment.baseHttpURL}/${this.controlerPrefix}/${climber.id}`, climber)
    /*console.log("update climber: " + JSON.stringify(climber));
    let c = this.climbersList.find(c => c.id === climber.id);
    console.log("found: " + JSON.stringify(c))
    if (c){

      let index = this.climbersList.indexOf(c)
      this.climbersList.splice(index, 1, climber);
      console.log("cl: " + JSON.stringify(this.climbersList));

    }

    return new Observable((observer) => {

    });*/

  }

  deleteClimber(climber: Climber) : Observable<string> {
    // NAPOMENA: Ukoliko rest servis vraca nesto sto nije objekat kao sto je ovde string morate da prosledite responseType: 'text'.
    // U suprotnom nece moci da radi jer ce pokusati da parsira ono body odgovora smatrajuci da je JSON objekat
    return this.httpClient.delete(`${environment.baseHttpURL}/${this.controlerPrefix}/${climber.id}`, {responseType: 'text'});
    
/*
    return new Observable((observer) => {
      console.log('searching for ' +  JSON.stringify(climber));
      let c = this.climbersList.find(c => c.id === climber.id);
      console.log("found: " + c)
      if (c){
        let index = this.climbersList.indexOf(c)
        this.climbersList.splice(index, 1);
        observer.next(c)
      } else{
        observer.error('Climber not found');
      }
    });
*/
  }
}

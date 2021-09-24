import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import * as internal from 'node:stream';
import { Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Competition, CompetitionSearchCriteria } from '../models';
import { Page } from '../models/page.dto';

export interface SimpleComp{
  id: number;
  name: string;   
}

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  controlerPrefix = 'competitions';
  /*
  competitionsList: Competition[] = [
    {name: "first 1", description: "last 1", registrationOpen: new Date(), registrationClose: new Date },
    {name: "first 2", description: "last 2", registrationOpen: new Date(), registrationClose: new Date },
    {name: "first 3", description: "last 3", registrationOpen: new Date(), registrationClose: new Date },
    {name: "first 4", description: "last 4", registrationOpen: new Date(), registrationClose: new Date },
    {name: "first 5", description: "last 5", registrationOpen: new Date(), registrationClose: new Date },
    {name: "first 6", description: "last 6", registrationOpen: new Date(), registrationClose: new Date }

  ];
*/
  constructor(private httpClient: HttpClient) { }



  getByPage(page:number, size: number, searchCriteria: CompetitionSearchCriteria): Observable<Page<Competition[]>> {
    // return this.httpClient.get<Page<Competition[]>>(`${environment.baseHttpURL}/${this.controlerPrefix}/page?page=${page}&size=${size}`)
// &firstName=${searchCriteria?.firstName}&lastName=${searchCriteria?.lastName}&yearOfBirth=${searchCriteria?.yearOfBirth}
    let filter = searchCriteria.name  ? `&name=${searchCriteria.name}` : ""; 
    filter += searchCriteria.registrationOpen ? `&lastName=${searchCriteria?.registrationOpen}` : "";

    return this.httpClient.get<Page<Competition[]>>(`${environment.baseHttpURL}/${this.controlerPrefix}?pageNumber=${page}&pageSize=${size}${filter}`)
    .pipe(map((resp) => {
      console.log(`response for page: ${JSON.stringify(resp)}`);
      // resp.content.forEach(comp => {
        // comp.registrationOpen = null;
        // comp.registrationClose = null;
      // })
      return resp;
    }));
    
    ;
  /*  console.log("page " + page + ", size: " + size);
    console.log("page " + page + ", size: " + size);
    return {content : this.competitionsList.slice(page  * size, (page + 1)  * size),
      number: page,
       size: size,
        totalElements: this.competitionsList.length};*/
  }

  getById(id: number): Observable<Competition> {
    let comp = this.httpClient.get<Competition>(`${environment.baseHttpURL}/${this.controlerPrefix}/${id}`);
//    .pipe(catchError((error) => { console.log('ERROR: ', error); }))) 
    
    return comp.pipe(map((resp) => {
      resp.registrationOpen = resp.registrationOpen ?  new Date(resp.registrationOpen): null;
      resp.registrationClose = resp.registrationClose ? new Date(resp.registrationClose): null;

      resp.registrationFees.forEach(fee => {
        fee.startDate = new Date(fee.startDate);
        fee.endDate = new Date(fee.endDate);
      });
            return resp;
    }));
      
    // comp.registrationOpen = comp.registrationOpen ? new Date(comp.registrationOpen) : null;
    // return comp; 
    /*return new Observable((observer) => {
      
      let c = this.competitionsList.find(c => c.id === id);
      console.log("found: " + c)
      if (c){
        observer.next(c)
      } else{
        observer.error('Competition not found');
      }
    });*/
  }


  insertCompetition(competition: Competition): Observable<SimpleComp> {
    return this.httpClient.post<SimpleComp>(`${environment.baseHttpURL}/${this.controlerPrefix}`, competition);
/*    console.log("inserting: " + JSON.stringify(competition));
    return new Observable((observer) => {
      

      let max = this.competitionsList.map(c => c.id).reduce((p, c) => p > c ? p : c);
      console.log("maxId: " + max)
      competition.id = max + 1;
      this.competitionsList.push(competition);
      console.log("inserting: " + JSON.stringify(competition));
      console.log("cl: " + JSON.stringify(this.competitionsList));
      observer.next(competition);

    });*/
  }

  updateCompetition(competition: Competition) : Observable<Competition>{
    console.log(JSON.stringify(`comp in comp service update: ${JSON.stringify(competition)}`))
    return this.httpClient.put<Competition>(`${environment.baseHttpURL}/${this.controlerPrefix}/${competition.id}`, competition)
    /*console.log("update competition: " + JSON.stringify(competition));
    let c = this.competitionsList.find(c => c.id === competition.id);
    console.log("found: " + JSON.stringify(c))
    if (c){

      let index = this.competitionsList.indexOf(c)
      this.competitionsList.splice(index, 1, competition);
      console.log("cl: " + JSON.stringify(this.competitionsList));

    }

    return new Observable((observer) => {

    });*/

  }

  deleteCompetition(competition: Competition) : Observable<string> {
    // NAPOMENA: Ukoliko rest servis vraca nesto sto nije objekat kao sto je ovde string morate da prosledite responseType: 'text'.
    // U suprotnom nece moci da radi jer ce pokusati da parsira ono body odgovora smatrajuci da je JSON objekat
    return this.httpClient.delete(`${environment.baseHttpURL}/${this.controlerPrefix}/${competition.id}`, {responseType: 'text'});
    
/*
    return new Observable((observer) => {
      console.log('searching for ' +  JSON.stringify(competition));
      let c = this.competitionsList.find(c => c.id === competition.id);
      console.log("found: " + c)
      if (c){
        let index = this.competitionsList.indexOf(c)
        this.competitionsList.splice(index, 1);
        observer.next(c)
      } else{
        observer.error('Competition not found');
      }
    });
*/
  }
}


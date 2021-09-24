import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDetails } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  controlerPrefix = 'public/auth';
  loggedUser: UserDetails;

  userLoginData: Subject<UserDetails> = new Subject();

  constructor(private httpClient: HttpClient) {
    // localStorage.removeItem('token'); // COMENT THIS SO TOKEN SURVIVES PAGE RELOAD
    let localUser = localStorage.getItem('loggedUser');
    if (localUser){
      this.loggedUser = JSON.parse(localUser);
    }
  }


  login({username, password}) {
     return this.httpClient.post<UserDetails>(`${environment.baseHttpURL}/${this.controlerPrefix}/login`, {username, password},
      {observe: 'response'});
    // return this.httpClient.get<UserDetails>(`${environment.baseHttpURL}/${this.controlerPrefix}/login`,
    // {
    //   headers: {'Authorization': 'Basic ' + btoa(`${username}:${password}`) }
    //   }
    // )

    // headers: {'Authorization': 'Basic ' + btoa(username+':' + password) }
  }

  setLoggedUser(user: UserDetails) {
    this.loggedUser = user;
    localStorage.setItem('loggedUser', JSON.stringify(user));
    this.userLoginData.next(user);
  }

  logut() {
    this.loggedUser = null;
    this.userLoginData.next(null);
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
  }

}

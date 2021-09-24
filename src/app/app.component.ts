import { Component, Injectable, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './core/service/user.service';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
 @Injectable()
 export class CustomAdapter extends NgbDateAdapter<string> {
 
   readonly DELIMITER = '-';
 
   fromModel(value: string | null): NgbDateStruct | null {
     if (value) {
       let date = value.split(this.DELIMITER);
       return {
         day : parseInt(date[0], 10),
         month : parseInt(date[1], 10),
         year : parseInt(date[2], 10)
       };
     }
     return null;
   }
 
   toModel(date: NgbDateStruct | null): string | null {
     return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
   }
 }
 
 /**
  * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
  */
 @Injectable()
 export class CustomDateParserFormatter extends NgbDateParserFormatter {
 
   readonly DELIMITER = '/';
 
   parse(value: string): NgbDateStruct | null {
     if (value) {
       let date = value.split(this.DELIMITER);
       return {
         day : parseInt(date[0], 10),
         month : parseInt(date[1], 10),
         year : parseInt(date[2], 10)
       };
     }
     return null;
   }
 
   format(date: NgbDateStruct | null): string {
     return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
   }
 }

 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // providers: [
  //   {provide: NgbDateAdapter, useClass: CustomAdapter},
  //   {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  // ]
})
export class AppComponent implements OnInit {

  title = 'final-app';

  isUserLoggedIn = true;

  constructor( public userService: UserService, private translate: TranslateService) {
    this.translate.use('en');
  }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.isUserLoggedIn = true;
    }
    this.startMonitoringLonginChanges();
  }

  startMonitoringLonginChanges() {
    this.userService.userLoginData.subscribe(
      userDetails => {
        this.isUserLoggedIn = userDetails? true : false;
        console.log('App Component:', userDetails);
      }
    );
  }

}

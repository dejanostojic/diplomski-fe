import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserDetails } from 'src/app/core';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  selectedLanguage: string = 'en';

  subscriptions: Subscription = new Subscription();
  userDetails: UserDetails;
  @Output() logout: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router,public userService: UserService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.subscriptions.add(this.userService.userLoginData.subscribe(
      userDetails => {
        this.userDetails = userDetails;
        console.log('Header:', userDetails);

      })
    );
  }

  onLanguageChange(language: string) {
    this.selectedLanguage = language;
    this.translate.use(this.selectedLanguage);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onLogout() {
    localStorage.removeItem('token');
    this.userService.logut();
    this.router.navigate(['/login']);

  }

}

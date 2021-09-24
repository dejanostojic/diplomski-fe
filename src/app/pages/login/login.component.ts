import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/service/user.service';
import { ToastService } from 'src/app/core/service/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, 
    private httpUser: UserService,
    private router: Router,
    private toastService: ToastService
    ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      username: ['student', [Validators.required]],
      password: ['student', [Validators.required]]
    })
  }

  login() {
    console.log(this.loginForm.value);
    this.httpUser.login(this.loginForm.value)
    .subscribe(
      (response: HttpResponse<any>) => {
        console.log(response);

        const keys = response.headers.keys();
         keys.forEach(key =>
          console.log(`header: ${key}: ${response.headers.get(key)}`));
  
        let authToken = response.headers.get("Authorization");
        console.log('response:', JSON.stringify(response));
        console.log('response token: ', authToken);
        console.log('response.headers: ', response.headers);
        console.log('response body:', response.body);
        
        localStorage.setItem('token', authToken);
        this.httpUser.setLoggedUser(response.body);
        this.router.navigate(['/home']);
      },
      error => {
        this.toastService.show('Wrong username or password: ' , {header:'Login failed', classname: 'bg-danger text-light'});
        console.log('error:', error);
      }
    );

  }
}

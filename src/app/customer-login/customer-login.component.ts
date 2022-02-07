import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl,FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.css']
})
export class CustomerLoginComponent implements OnInit {
  server_url = 'http://localhost:3000/Customer-Login';
  form: FormGroup;
  username: string = "";
  password: string ="";
  response: string ="";

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient,private route:Router,private authService : AuthService,private titleService: Title) {
    this.form = this.formBuilder.group({
      username: '',
      password:'',

    });
  }
  submit()
  {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

    this.username = this.form.get('username')?.value;
    this.password = this.form.get('password')?.value;
    console.log(this.username);
    let user = {
      username :this.username,
      password :this.password
    }

    this.httpClient.post(this.server_url,JSON.stringify(user), {
      headers: headers
    }).subscribe(
      (data:any) => {
          if(data['status']==101){
            alert('Successfully Logged In!');
            console.log('Success');
            localStorage.setItem('isLoggedIn', "true");
            this.setTitle('Customer Portal Dashboard');
            localStorage.setItem('token', this.username);
            (<any>this.route).navigate(['customer-dashboard']);}
            else if(data['status']==100){
              alert('Login Unsuccessful')
              this.authService.logout();
            }
            else if(data['status']==102){
              alert('Customer ID Invalid')
              this.authService.logout();
            }
      }
    )}
    setTitle(newTitle: string) {
      this.titleService.setTitle(newTitle);
    }
  ngOnInit(): void {
    this.authService.logout(); //on initial loading of login component
  }
  myFunction() {
    let x : any = document.getElementById("inputPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
}

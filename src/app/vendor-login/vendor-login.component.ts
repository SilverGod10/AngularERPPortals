import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl,FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-vendor-login',
  templateUrl: './vendor-login.component.html',
  styleUrls: ['./vendor-login.component.css']
})
export class VendorLoginComponent implements OnInit {
  server_url = 'http://localhost:3050/vendor-login';
  form: FormGroup;
  vendorid: string="";
  vendorpass: string="";
  response: string ="";
  error:any;
  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient,private route:Router,private authService : AuthService,private titleService: Title) {
    this.form = this.formBuilder.group({
      vendorid: '',
      vendorpass:'',

    });
    this.error=false;
  }
  login()
  {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

    this.vendorid = this.form.get('vendorid')?.value
    this.vendorpass =  this.form.get('vendorpass')?.value
    console.log(this.vendorid);
    let vendetails = {
      vendorid :this.vendorid,
      vendorpass :this.vendorpass
    }

    this.httpClient.post(this.server_url,JSON.stringify(vendetails), {
      headers: headers
    }).subscribe(
      (data:any) => {
          if(data['status']==101){
            console.log('Success');
            alert('Successfully Logged In!')
            localStorage.setItem('isLoggedIn', "true");
            localStorage.setItem('token', this.vendorid);
            this.setTitle('Vendor Portal Dashboard');
            (<any>this.route).navigate(['vendor-dashboard']);}
            else{
              this.error=true;
              alert('Login Failed!')
              this.authService.logout();
            }
      }
    )}
    setTitle(newTitle: string) {
      this.titleService.setTitle(newTitle);
    }
  ngOnInit(): void {
    this.authService.logout(); //on initial loading of vendor component
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


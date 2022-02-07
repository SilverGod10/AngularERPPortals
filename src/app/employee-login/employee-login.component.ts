import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl,FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-employee-login',
  templateUrl: './employee-login.component.html',
  styleUrls: ['./employee-login.component.css']
})
export class EmployeeLoginComponent implements OnInit {
  emplogin_url = 'http://localhost:2100/employee-login';
  form: FormGroup;
  employeeid: string="";
  employeepass: string="";
  response: string ="";
  error:any;
  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient,private route:Router,private authService : AuthService,private titleService: Title) {
    this.form = this.formBuilder.group({
      employeeid: '',
      employeepass:'',

    });
    this.error=false;
  }
  login()
  {
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

    this.employeeid = this.form.get('employeeid')?.value
    this.employeepass =  this.form.get('employeepass')?.value
    console.log(this.employeeid);
    let empdetails = {
      employeeid :this.employeeid,
      employeepass :this.employeepass
    }

    this.httpClient.post(this.emplogin_url,JSON.stringify(empdetails), {
      headers: headers
    }).subscribe(
      (data:any) => {
          if(data['status']==101){
            console.log('Success');
            localStorage.setItem('isLoggedIn', "true");
            localStorage.setItem('token', this.employeeid);
            alert('Successfully Logged In!')
            this.setTitle('Employee Portal Dashboard');
            (<any>this.route).navigate(['employee-dashboard']);}
            else if(data['status']==100){
              alert('Employee Login Failed')
              this.error=true;
              this.authService.logout();
            }
            else if(data['status']==102){
              alert('Employee ID Invalid!')
              this.error=true;
              this.authService.logout();
            }
      }
    )}
    setTitle(newTitle: string) {
      this.titleService.setTitle(newTitle);
    }
  ngOnInit(): void {
    this.authService.logout(); //on initial loading of employee component
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

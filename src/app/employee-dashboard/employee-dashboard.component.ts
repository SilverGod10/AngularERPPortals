import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {  ViewChild, ElementRef } from "@angular/core";
import { FormGroup,FormBuilder } from '@angular/forms';
import { flatten } from '@angular/compiler';
import { DomSanitizer } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { ColDef, Grid } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {



  @ViewChild('agGrid') agGrid!: AgGridAngular;
  LeaveDetails_url = 'http://localhost:2200/Employee-LeaveDetails';
  LeaveQuota_url = 'http://localhost:2300/Employee-LeaveQuota';
  LeaveType_url = 'http://localhost:2400/Employee-LeaveType';
  EmpProf_url = 'http://localhost:2600/Employee-Profile';
  EmpEdit_url = 'http://localhost:2700/Employee-Edit';
  EmpPayPDF_url = 'http://localhost:2800/Employee-PayPDF';
  email_url = 'http://localhost:2900/sendmail';
  plist_url = 'http://localhost:2950/Employee-PayList';
  full_url = 'http://localhost:2980/Employee-FullFinal';
  leavereq_url = 'http://localhost:2500/Employee-FullFinal';
  employeeid:any;
  ViewHome:any;
  leavedetails:any;
  leavequota:any;
  leavetype:any;
  empprof:any;
  editemp:any;
  s:any;
  emplop:any;
  defaultColDef:any;
  EmpEditShow:any;
  domLayout:any;
  paginationPageSize:any;
  paginationNumberFormatter:any;
  leavedetails_status:any;
  leavetype_status:any;
  LeaveDetailsShow:any;
  leavequota_status:any;
  LeaveQuotaShow:any;
  LeaveTypeShow:any;
  empprof_status:any;
  EmpProfShow:any;
  gridTheme:string='ag-theme-alpine';
  FirstName:string='';
  LastName:string='';
  City:string='';
  District:string='';
  EMail:string='';
  Street:string='';
  PostalCode:string='';
  Country:string='';
  Telephone:string='';
  editdata:any;
  sequencenum:any;
  variant:any;
  fileURL:any;
  PSPDF:any;
  Name:any;
  Email:any;
  File:any;
  EmailShow:any;
  paystatus:any;
  paylist:any;
  PayListShow:any;
  currThemeIndex:any=0;
  FullFinalShow:any;
  colDefs:ColDef[]=[];
  colDefs1:ColDef[]=[];
leave_det_column : String[] = ['EMPLOYEE_NUMBER','SUBTYPE','VALIDITY_END','VALIDITY_BEGIN','SINGLE_RECORD_NUMBER','START','END','ABSENCE_TYPE','NAME_ABSENCE_TYPE','ABSENCE_DAYS','ABSENCE_HOURS']
leave_rem_column : String[] = ['QUOTA_TYPE','LEAVE_TYPE','QUOTA_TEXT','QUOTA_END','QUOTA_BEGIN','ENTITLE','DEDUCT','ORDERED','QUOTA_NUMBER','TIME_UNIT']
leave_quota_det : String[] = ['QUOTA_NUMBER','QUOTA_TYPE','QUOTA_TEXT','FROM_DATE','TO_DATE','DEDUCTION_BEGIN','DEDUCTION_END','ENTITLE','TRANSFER','DEDUCT','ORDERED', 'REDUCED','REDUCED_SINCE',  'ACCOUNT','REST','REST_FREE','TIME_UNIT_TEXT', 'TIME_UNIT','MEASUREMENT','ISOCODE_UNIT']
leave_type_det : String[] = ['LANGUAGE','PERSONNEL_SUBAREA_GROUPING','ABSENCE_TYPE','ABSENCE_TYPE_TEXT']
pay_list_det : String[] = ['SEQUENCE_NUMBER','FINANCIAL_POSTING_PERIOD','FINANCIAL_PERIOD_BEGIN','FINANCIAL_PERIOD_END','BONUS_DATE','PAYMENT_DATE','PAYMENT_TYPE_TEXT']
editform: FormGroup;
  PayForm:FormGroup;
  EmailForm:FormGroup;
  LeaveForm:FormGroup;
  user: any;
  fileContent:any;
  oppay: any;
  emplreq:any;
  LeaveRequestShow:any;
  currThemeIndex1:any=0;
  currThemeIndex2:any=0;
  currThemeIndex3:any=0;
  currThemeIndex4:any=0;
  currThemeIndex5:any=0;
  gridTheme1: string='ag-theme-alpine';
  gridTheme2: string='ag-theme-alpine';
  gridTheme3: string='ag-theme-alpine';
  gridTheme4: string='ag-theme-alpine';
  gridTheme5: string='ag-theme-alpine';
  empfull: any;
  empfffstatus: any;
  StartDate:any;
  EndDate: any;
  StartTime: string='';
  EndTime: string='';
  Hours: string='';
  AbType: string='';
  data:any;
  constructor(private router: Router, private authService: AuthService,private httpClient: HttpClient,private formBuilder: FormBuilder,public sanitizer: DomSanitizer,private titleService: Title,@Inject(DOCUMENT) private document: Document) {
    this.employeeid=''
    this.leavedetails_status=false;
    this.LeaveDetailsShow=false;
    this.leavequota_status=false;
    this.LeaveQuotaShow=false;
    this.EmailShow=false;
    this.leavetype_status=false;
    this.empprof_status=false;
    this.EmpProfShow=false;
    this.LeaveTypeShow=false;
    this.editemp=false;
    this.EmpEditShow=false;
    this.paystatus=false;
    this.PayListShow=false;
    this.FullFinalShow=false;
    this.empfffstatus=false;
    this.emplreq=false;
    this.LeaveRequestShow=false;
    this.editform = this.formBuilder.group({

      FirstName:'',
      LastName:'',
      City:'',
      Telephone:'',
      Region:'',
      District:'',
      Street:'',
      PostalCode:'',
      Country:''
    });
    this.LeaveForm = this.formBuilder.group({

      StartDate:'',
      EndDate:'',
      StartTime:'',
      EndTime:'',
      Hours:'',
      AbType:'',

    });
    this.PayForm = this.formBuilder.group({

      sequencenum:'',
      variant:''
    });
    this.EmailForm = this.formBuilder.group({

      Name:'',
      Email:''
    });


   }
changeTheme(op:any){
  if(op===1){
  this.currThemeIndex1+=1
  console.log(this.currThemeIndex1)
  if(this.currThemeIndex1%2!=0){
    this.gridTheme1='ag-theme-alpine-dark'
  }
  else if(this.currThemeIndex1%2==0){
    this.gridTheme1='ag-theme-alpine'
  }
}
else if(op===2){
  this.currThemeIndex2+=1
  if(this.currThemeIndex2%2!=0){
    this.gridTheme2='ag-theme-alpine-dark'
  }
  else if(this.currThemeIndex2%2==0){
    this.gridTheme2='ag-theme-alpine'
  }
}
else if(op===3){
  this.currThemeIndex3+=1
  if(this.currThemeIndex3%2!=0){
    this.gridTheme3='ag-theme-alpine-dark'
  }
  else if(this.currThemeIndex3%2==0){
    this.gridTheme3='ag-theme-alpine'
  }
}
else if(op===4){
  this.currThemeIndex4+=1
  if(this.currThemeIndex4%2!=0){
    this.gridTheme4='ag-theme-alpine-dark'
  }
  else if(this.currThemeIndex4%2==0){
    this.gridTheme4='ag-theme-alpine'
  }
}
else if(op===5){
  this.currThemeIndex5+=1
  if(this.currThemeIndex5%2!=0){
    this.gridTheme5='ag-theme-alpine-dark'
  }
  else if(this.currThemeIndex5%2==0){
    this.gridTheme5='ag-theme-alpine'
  }
}
}

  ngOnInit(): void {
    this.ViewHome=true;
    this.employeeid = <string>localStorage.getItem('token');
    let s = document.createElement('script');
    s.setAttribute('src','https://cdn.cai.tools.sap/webchat/webchat.js');
    s.setAttribute('channelId','a27592a5-01bf-41ba-ba1a-79fe2507ba48');
    s.setAttribute('token','8fb3b7ea588c127b8e7810c27e0023a9');
    s.setAttribute('id','cai-webchat');
    document.body.appendChild(s);
    this.setTitle('Employee Portal Dashboard')
    console.log(this.employeeid);
  }
  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  EmpLeaveDetails(){
    this.emplreq=false;
    this.LeaveRequestShow=false;
    this.currThemeIndex1=0;
    this.gridTheme1='ag-theme-alpine';
    this.currThemeIndex5=0;
    this.gridTheme5='ag-theme-alpine';
    this.editemp=false;
    this.FullFinalShow=false;
    this.empfffstatus=false;
    this.EmpEditShow=false;
    this.empprof_status=false;
    this.EmpProfShow=false;
    this.leavedetails_status=true;
    this.leavequota_status=false;
    this.LeaveQuotaShow=false;
    this.leavetype_status=false;
    this.LeaveTypeShow=false;
    this.ViewHome=false;
    this.EmailShow=false;
    this.paystatus=false;
    this.PayListShow=false;
    setTimeout(()=>this.LeaveDetailsShow=true, 10000);
    this.employeeid = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let employeejson = {
      employeeid :this.employeeid,
    }
    this.leavedetails = this.httpClient.post(this.LeaveDetails_url,JSON.stringify(employeejson), {
      headers: headers
    }).subscribe(
      (data:any) => {
        this.leavedetails = data
        console.log(data)
      })
      this.dynamicallyConfigureColumnsFromObject(this.leave_det_column)
      this.dynamicallyConfigureColumnsFromObject1(this.leave_rem_column)
      this.defaultColDef = {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true,
        minWidth: 1500/(this.leave_det_column.length),
        suppressSizeToFit: false
      };
      this.domLayout = 'autoHeight';
      this.paginationPageSize = 10;
    this.paginationNumberFormatter = function (params:any) {
      return '[' + params.value.toLocaleString() + ']';
    };

  }
  EmpLeaveQuota(){
    this.emplreq=false;
    this.LeaveRequestShow=false;
    this.currThemeIndex2=0;
    this.gridTheme2='ag-theme-alpine';
    this.editemp=false;
    this.EmpEditShow=false;
    this.FullFinalShow=false;
    this.empfffstatus=false;
    this.empprof_status=false;
    this.EmpProfShow=false;
    this.leavedetails_status=false;
    this.leavequota_status=true;
    this.LeaveDetailsShow=false;
    this.leavetype_status=false;
    this.LeaveTypeShow=false;
    this.ViewHome=false;
    this.EmailShow=false;
    this.paystatus=false;
    this.PayListShow=false;
    setTimeout(()=>this.LeaveQuotaShow=true, 10000);
    this.employeeid = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let employeejson = {
      employeeid :this.employeeid,
    }
    this.leavequota = this.httpClient.post(this.LeaveQuota_url,JSON.stringify(employeejson), {
      headers: headers
    }).subscribe(
      (data:any) => {
        this.leavequota = data
        console.log(data)

      })
      this.dynamicallyConfigureColumnsFromObject(this.leave_quota_det)
      this.defaultColDef = {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true,
        minWidth: 1500/(this.leave_quota_det.length),
        suppressSizeToFit: false
      };
      this.domLayout = 'autoHeight';
      this.paginationPageSize = 10;
    this.paginationNumberFormatter = function (params:any) {
      return '[' + params.value.toLocaleString() + ']';
    };

  }

  EmpLeaveType(){
    this.emplreq=false;
    this.LeaveRequestShow=false;
    this.currThemeIndex3=0;
    this.gridTheme3='ag-theme-alpine';
    this.editemp=false;
    this.EmpEditShow=false;
    this.empprof_status=false;
    this.EmpProfShow=false;
    this.FullFinalShow=false;
    this.empfffstatus=false;
    this.leavetype_status=true;
    this.leavequota_status=false;;
    this.LeaveQuotaShow=false;
    this.leavedetails_status=false;
    this.LeaveDetailsShow=false;
    this.ViewHome=false;
    this.EmailShow=false;
    this.paystatus=false;
    this.PayListShow=false;
    setTimeout(()=>this.LeaveTypeShow=true, 10000);
    this.employeeid = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let employeejson = {
      employeeid :this.employeeid,
    }
    this.leavetype = this.httpClient.post(this.LeaveType_url,JSON.stringify(employeejson), {
      headers: headers
    }).subscribe(
      (data:any) => {
        this.leavetype = data
        console.log(data)
      })
      this.dynamicallyConfigureColumnsFromObject(this.leave_type_det)
      this.defaultColDef = {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter:true,
        minWidth: 1500/(this.leave_type_det.length),
        suppressSizeToFit: false
      };
      this.domLayout = 'autoHeight';
      this.paginationPageSize = 10;
    this.paginationNumberFormatter = function (params:any) {
      return '[' + params.value.toLocaleString() + ']';
    };

  }

  EmpProfile(){
    this.emplreq=false;
    this.LeaveRequestShow=false;
    this.editemp=false;
    this.EmpEditShow=false;
    this.empprof_status=true;
    this.paystatus=false;
    this.PayListShow=false;
    this.ViewHome=true;
    this.FullFinalShow=false;
    this.empfffstatus=false;
    this.leavetype_status=false;
    this.LeaveDetailsShow=false;
    this.leavequota_status=false;
    this.LeaveQuotaShow=false;
    this.leavedetails_status=false;
    this.LeaveDetailsShow=false;
    this.EmailShow=false;
    setTimeout(()=>this.EmpProfShow=true, 10000);
    this.employeeid = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let employeejson = {
      employeeid :this.employeeid,
    }
    this.empprof = this.httpClient.post(this.EmpProf_url,JSON.stringify(employeejson), {
      headers: headers
    }).subscribe(
      (data:any) => {
        this.empprof = data
        console.log(data)
      })
  }
  FullFinal(){
    this.emplreq=false;
    this.LeaveRequestShow=false;
    this.empfffstatus=true;
    this.leavedetails_status=false;
    this.LeaveDetailsShow=false;
    this.leavequota_status=false;
    this.LeaveQuotaShow=false;
    this.ViewHome=false;
    this.EmailShow=false;
    this.leavetype_status=false;
    this.empprof_status=false;
    this.EmpProfShow=false;
    this.LeaveTypeShow=false;
    this.editemp=false;
    this.EmpEditShow=false;
    this.paystatus=false;
    this.PayListShow=false;
    setTimeout(()=>this.FullFinalShow=true, 10000);
    this.employeeid = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let employeejson = {
      employeeid :this.employeeid,
    }
    this.empfull = this.httpClient.post(this.full_url,JSON.stringify(employeejson), {
      headers: headers
    }).subscribe(
      (data:any) => {
        this.empfull = data
        console.log(data)
      })
  }


  EditDetails(){
    this.emplreq=false;
    this.LeaveRequestShow=false;
    this.leavedetails_status=false;
    this.LeaveDetailsShow=false;
    this.leavequota_status=false;
    this.LeaveQuotaShow=false;
    this.leavetype_status=false;
    this.empprof_status=false;
    this.EmpProfShow=false;
    this.LeaveTypeShow=false;
    this.editemp=true
    this.FullFinalShow=false;
    this.empfffstatus=false;
    this.ViewHome=true;
    this.EmailShow=false;
    this.paystatus=false;
    this.PayListShow=false;
    const headers = new HttpHeaders()
            .set('Content-Type', 'application/json');

      this.FirstName = this.editform.get('FirstName')?.value;
      this.LastName = this.editform.get('LastName')?.value;
      this.Telephone = this.editform.get('Telephone')?.value;
      this.Street = this.editform.get('Street')?.value;
      this.City = this.editform.get('City')?.value;
      this.District = this.editform.get('District')?.value;
      this.PostalCode = this.editform.get('PostalCode')?.value;
      this.Country = this.editform.get('Country')?.value;
      this.EMail = this.editform.get('EMail')?.value;
      let employeedetails = {
      employeeid:this.employeeid,
      FirstName:this.FirstName,
      LastName:this.LastName,
      Telephone:this.Telephone,
      Street:this.Street,
      City:this.City,
      District:this.District,
      email:this.EMail,
      PostalCode:this.PostalCode,
      Country:this.Country
      }
      this.editdata = this.httpClient.post(this.EmpEdit_url,JSON.stringify(employeedetails), {
        headers: headers
      }).subscribe(
        (data:any) => {
          this.editdata = data
        })
        setTimeout(()=>this.EmpEditShow=true, 10000);

  }
  LeaveReq(){
    this.leavedetails_status=false;
    this.LeaveDetailsShow=false;
    this.leavequota_status=false;
    this.LeaveQuotaShow=false;
    this.leavetype_status=false;
    this.empprof_status=false;
    this.EmpProfShow=false;
    this.LeaveTypeShow=false;
    this.editemp=false;
    this.FullFinalShow=false;
    this.empfffstatus=false;
    this.ViewHome=true;
    this.EmailShow=false;
    this.paystatus=false;
    this.PayListShow=false;
    this.emplreq=true;
    const headers = new HttpHeaders()
            .set('Content-Type', 'application/json');

      this.StartDate = this.LeaveForm.get('StartDate')?.value;
      var formattedDate1 = moment(this.StartDate).format('YYYY-MM-DD');

      this.EndDate= this.LeaveForm.get('EndDate')?.value;
      var formattedDate2 = moment(this.EndDate).format('YYYY-MM-DD');
      this.StartTime = this.LeaveForm.get('StartTime')?.value;
      this.EndTime = this.LeaveForm.get('EndTime')?.value;
      this.Hours = this.LeaveForm.get('Hours')?.value;
      this.AbType = this.LeaveForm.get('AbType')?.value;
      let employeeleavereq = {
      employeeid:this.employeeid,
      bdate:formattedDate1,
      edate:formattedDate2,
      stime:this.StartTime,
      etime:this.EndTime,
      abhours:this.Hours,
      abtype:this.AbType,
      }
      this.emplop = this.httpClient.post(this.leavereq_url,JSON.stringify(employeeleavereq), {
        headers: headers
      }).subscribe(
        (data:any) => {
          this.emplop = data
        })
        setTimeout(()=>this.LeaveRequestShow=true, 10000);

  }
  onClick() {
    var data = document.getElementById('final')!;
    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('FullFinal.pdf');
    });

  }
PayView(){
  this.emplreq=false;
  this.LeaveRequestShow=false;
  this.leavedetails_status=false;
  this.LeaveDetailsShow=false;
  this.leavequota_status=false;
  this.LeaveQuotaShow=false;
  this.ViewHome=true;
  this.leavetype_status=false;
  this.empprof_status=false;
  this.EmpProfShow=false;
  this.LeaveTypeShow=false;
  this.FullFinalShow=false;
  this.empfffstatus=false;
  this.editemp=false;
  this.EmpEditShow=false;
  this.EmailShow=false;
  this.paystatus=false;
    this.PayListShow=false;
  const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

    this.sequencenum = this.PayForm.get('sequencenum')?.value;
    this.variant = this.PayForm.get('variant')?.value;
    let PayPDFdetails = {
      employeeid:this.employeeid,
      sequencenum:this.sequencenum,
      variant:this.variant,
    }
    this.PSPDF = this.httpClient.post(this.EmpPayPDF_url,JSON.stringify(PayPDFdetails), {
      headers: headers
    }).subscribe(
      (data:any) => {

          const linkSource = 'data:application/pdf;base64,' + data['PAYPDF']
          const downloadLink = document.createElement("a");
          const fileName = this.sequencenum+'.pdf';


          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          console.log(downloadLink)
          downloadLink.click();
         this.fileURL = 'C:/Users/ADITYA/Downloads/'+ fileName

          localStorage.setItem("PDFpath",this.fileURL);
          //console.log(this.fileURL)

})
}
onSubmit(){
  this.emplreq=false;
  this.LeaveRequestShow=false;
  this.leavedetails_status=false;
  this.LeaveDetailsShow=false;
  this.leavequota_status=false;
  this.LeaveQuotaShow=false;
  this.ViewHome=true;
  this.leavetype_status=false;
  this.empprof_status=false;
  this.EmpProfShow=false;
  this.LeaveTypeShow=false;
  this.editemp=false;
  this.EmpEditShow=false;
  this.paystatus=false;
    this.PayListShow=false;
    this.FullFinalShow=false;
    this.empfffstatus=false;
  this.fileURL = <string>localStorage.getItem('PDFpath');
  this.Name = this.EmailForm.get('Name')?.value;
  this.Email = this.EmailForm.get('Email')?.value;
  const headers = new HttpHeaders()
  .set('Content-Type', 'application/json');
  var mailData = {
    to:this.Email,
    from:this.Name,
    attachment:this.fileURL
 }
 setTimeout(() => {
   this.EmailShow=true;
 }, 10000);
console.log(mailData)
 this.httpClient.post(this.email_url,JSON.stringify(mailData),{ headers:headers }).subscribe((data:any) => {
  if(data['output'] == 'success'){
   this.oppay="Error While Sending E-Mail"
   alert(this.oppay)
  }
  else{
   this.oppay="E-Mail Sent Successfully";
   alert(this.oppay)
  }
 });
}
PaySlipUpload(event: any) {
  if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
  this.user.fileContent = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
  }
}

dynamicallyConfigureColumnsFromObject(object:any){
  this.colDefs=[];
 object.forEach((value: any) => {
  this.colDefs.push({headerName:`${value}`,field:`${value}`})
 });
  return this.colDefs
}
dynamicallyConfigureColumnsFromObject1(object:any){
  this.colDefs1=[];
 object.forEach((value: any) => {
  this.colDefs1.push({headerName:`${value}`,field:`${value}`})
 });
  return this.colDefs1
}

EmpPayList(){
  this.emplreq=false;
  this.LeaveRequestShow=false;
  this.currThemeIndex4=0;
  this.gridTheme4='ag-theme-alpine';
  this.leavedetails_status=false;
  this.LeaveDetailsShow=false;
  this.leavequota_status=false;
  this.LeaveQuotaShow=false;
  this.ViewHome=false;
  this.EmailShow=false;
  this.leavetype_status=false;
  this.empprof_status=false;
  this.EmpProfShow=false;
  this.LeaveTypeShow=false;
  this.editemp=false;
  this.EmpEditShow=false;
  this.FullFinalShow=false;
    this.empfffstatus=false;
  this.paystatus=true;
  setTimeout(() => {
    this.PayListShow=true;
  }, 10000);
  const headers = new HttpHeaders()
  .set('Content-Type', 'application/json');
  let employeejson = {
    employeeid :this.employeeid,
  }
  this.paylist = this.httpClient.post(this.plist_url,JSON.stringify(employeejson), {
    headers: headers
  }).subscribe(
    (data:any) => {
      this.paylist = data
      console.log(data)
    })
    this.dynamicallyConfigureColumnsFromObject(this.pay_list_det)
    this.defaultColDef = {
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter:true,
      minWidth: 1500/(this.pay_list_det.length),
      suppressSizeToFit: false
    };
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
  this.paginationNumberFormatter = function (params:any) {
    return '[' + params.value.toLocaleString() + ']';
  };
}

Home(){
  this.leavedetails_status=false;
    this.LeaveDetailsShow=false;
    this.leavequota_status=false;
    this.LeaveQuotaShow=false;
    this.ViewHome=true;
    this.EmailShow=false;
    this.leavetype_status=false;
    this.empprof_status=false;
    this.EmpProfShow=false;
    this.LeaveTypeShow=false;
    this.editemp=false;
    this.EmpEditShow=false;
    this.paystatus=false;
    this.PayListShow=false;
    this.FullFinalShow=false;
    this.empfffstatus=false;
    this.emplreq=false;
    this.LeaveRequestShow=false;
}
  logout() {
    console.log('logout');
    if(!this.document.location.href.includes('/employee-login')){
    let s = document.createElement('script');
    s.setAttribute('id','');
    }
    localStorage.clear();
    this.setTitle('Login');
    this.authService.logout();
    this.router.navigate(['employee-login']);
  }

}

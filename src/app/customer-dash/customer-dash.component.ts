import { APP_BOOTSTRAP_LISTENER, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table'
import { AbstractControl,FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import {MatMenuModule} from '@angular/material/menu';
import { AngularFireStorage } from 'angularfire2/storage';
import {  ViewChild, ElementRef } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { ColDef, Grid } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular'


@Component({
  selector: 'app-customer-dash',
  templateUrl: './customer-dash.component.html',
  styleUrls: ['./customer-dash.component.css']
})

export class CustomerDashComponent implements OnInit {
  inq_url = 'http://localhost:5000/Customer-Inquiry';
  sales_url = 'http://localhost:8000/Customer-Sales';
  del_url = 'http://localhost:8080/Customer-Delivery';
  credit_url = 'http://localhost:5400/Customer-Credit';
  debit_url = 'http://localhost:4400/Customer-Debit';
  edit_url = 'http://localhost:5600/Customer-Edit';
  pay_url = 'http://localhost:8200/Customer-Pay';
  master_url = 'http://localhost:4800/Customer-Master';
  details_url = 'http://localhost:8400/Customer-Details';
  @ViewChild('agGrid') aGrid!: AgGridAngular;

  public showContent: boolean = false;
  id : any;
  items:any;
  sales:any;
  head:any;
  viewmenu:any;
  mastermenu:any;
  delivery:any;
  credit:any;
  debit:any;
  editcust:any;
  payage:any;
  viewdet:any;
  SideNav:any;
  url:any;
  count:any=0;
  gridOptions:any;
  colDefs:ColDef[]=[];
  colDefs1:ColDef[]=[];
  inquirystatus:boolean;
  salesstatus:boolean;
  deliverystatus:boolean;
  creditstatus:boolean;
  debitstatus:boolean;
  editdetails:boolean;
  paymentsstatus:boolean;
  FirstName : string="";
  LastName: string="";
  CustomerNumber: string="";
  MobileNumber:string='';
  AlternateNumber:string='';
  StreetNumber:string='';
  City:string='';
  District:string='';
  Region:string='';
  PinCode:string='';
  CountryCode:string='';
  file:any;
  filelist:any;
  arrayBuffer:any;
  master:any;
  EditDetails:any;
  InquiryShow:any;
  SalesShow:any;
  DeliveryShow:any;
  CreditShow:any;
  PayShow:any;
  DebitShow:any;
  ViewDetails:any;
  event:any;
  ref:any;
  task:any;
  downloadURL:any;
  uploadProgress:any;
  ViewHome:any;
  MasterDetails:any;
  headerColumns  :  string[] = ['DOC_NUMBER','OPER','REC_DATE','REC_TIME','CREATED_BY','DOC_DATE','TRAN_GROUP','DOC_TYPE','NET_VAL','CURRENCY','SALES_ORG'];
  itemColumns  :  string[] = ['DOC_NUMBER','ITM_NUMBER','MATERIAL','MAT_ENTRD','MATL_GROUP','SHORT_TEXT','ITEM_CATEG','ORDER_PROB','CREAT_DATE','CREATED_BY'];
  salesColumns  :  string[] = ['SD_DOC','ITM_NUMBER','MATERIAL','SHORT_TEXT','DOC_TYPE','DOC_DATE','REQ_QTY','REQ_DATE','PURCH_NO','VALID_FROM','VALID_TO','SOLD_TO','NAME','EXCHG_RATE','DLV_QTY','BASE_UOM','NET_PRICE','COND_P_UNT','COND_UNIT','NET_VAL_HD','DIVISION','DOC_STATUS','SALES_GRP','SALES_OFF','SALES_ORG','SALES_UNIT','SHIP_POINT','DISTR_CHAN','GI_DATE','CURRENCY','PLANT','B_UOM_ISO','CD_UNT_ISO','S_UNIT_ISO','CURR_ISO','PURCH_NO_C','EXCHG_RATE_V','CREATION_DATE','CREATION_TIME','STATUS_DOC'];
  deliveryheader: string[]= ['MANDT','VBELN','ERNAM','ERZET','ERDAT','VSTEL','VKORG','LFART','KZAZU','WADAT','LDDAT','TDDAT','LFDAT','KODAT','INCO1','INCO2','VBTYP','LPRIO','VSBED','KUNNR','KUNAG','BTGEW','NTGEW','GEWEI','GRULG','TRAGR','FKDAT','KALSM','WAERK','ZUKRL','STWAE','AENAM','AEDAT','FKAIV','BLDAT','WADAT_IST','HANDLE','TSEGFL','TSEGTP','TZONIS','TZONRC','KZWAB','TCODE','SPE_WAUHR_IST','SPE_WAZONE_IST','SPE_REL_TMSTMP']
  deliveryitems: string[] = ['MANDT','VBELN','POSNR','PSTYV','ERNAM','ERZET','ERDAT','MATNR','MATWA','WERKS','LGORT','LFIMG','MEINS','VRKME','UMVKZ','UMVKN','NTGEW','BRGEW','GEWEI','MBDAT','LGMNG','ARKTX','VGBEL','VGPOS','UPFLU','FKREL','LADGR','TRAGR','KOMKZ','BWART','BDART','PLART','MTART','VGREF','SUMBD','MTVFP','VTWEG','SPART','AEDAT','VGTYP','PAOBJNR','UMREF','BEDAR_LF','CMPNT','QPLOS','LFIMG_FLO','LGMNG_FLO','KCMENG_FLO','KZBEW','MBUHR','HANDLE','AKKUR','AKMNG','SPE_INSPOUT_GUID','ORMNG','SPE_ATP_TMSTMP']
  creditmemo: string[] = [ 'MANDT','BUKRS','BELNR','GJAHR','BUZEI','AUGDT','AUGCP','AUGBL','BSCHL','KOART','DMBTR','WRBTR','KZBTR','PSWBT','PSWSL','TXGRP','VALUT','SGTXT','VORGN','KOKRS','XUMSW','XHRES','XKRES','XOPVW','SAKNR','HKONT','KUNNR','XBILK','ZFBDT','SKFBT','SKNTO','WSKTO','DMBT1','DMBT2','KLIBT','RDIF3','XRAGL','KKBER','AUGGJ','TAXPS','PEROP_BEG','PEROP_END','FMXYEAR']
  debitmemo: string[] = [ 'MANDT','BUKRS','BELNR','GJAHR','BUZEI','AUGDT','AUGCP','AUGBL','BSCHL','KOART','DMBTR','WRBTR','KZBTR','PSWBT','PSWSL','TXGRP','VALUT','SGTXT','VORGN','KOKRS','XUMSW','XHRES','XKRES','XOPVW','SAKNR','HKONT','KUNNR','XBILK','ZFBDT','SKFBT','SKNTO','WSKTO','DMBT1','DMBT2','KLIBT','RDIF3','XRAGL','KKBER','AUGGJ','TAXPS','PEROP_BEG','PEROP_END','FMXYEAR']
  paycol: string[] = ['COMP_CODE','CUSTOMER','FISC_YEAR','DOC_NO','ITEM_NUM','PSTNG_DATE','DOC_DATE','ENTRY_DATE','CURRENCY','LOC_CURRCY','DOC_TYPE','FIS_PERIOD','POST_KEY','DB_CR_IND','LC_AMOUNT','AMT_DOCCUR','LC_TAX','TX_DOC_CUR','DUE_DAYS','BLINE_DATE','DSCT_DAYS1','DSCT_DAYS2','NETTERMS','DSCT_PCT1','DSCT_PCT2','DISC_BASE','DSC_AMT_LC','INV_REF','INV_YEAR','INV_ITEM','NXT_DOCTYP','T_CURRENCY','AMOUNT','NET_AMOUNT','OBJ_TYPE','REF_DOC','REF_ORG_UN']

  inqhead: String[] = ['DOCUMENT_NUMBER','OPERATION','RECEIPT_DATE','RECEIPT_TIME','CREATED_BY','DOCUMENT_DATE','TRANSACTION_GROUP','DOCUMENT_TYPE','NET_VALUE','CURRENCY','SALES_ORGANIZATION']
  inqitem: String[] = ['DOCUMENT_NUMBER','ITEM_NUMBER','MATERIAL_NUMBER','DESCRIPTION','ITEM_CATEGORY','ORDER_PROBABILITY','CREATED_DATE','CREATED_BY']
  salesitem: String[] = ['SALES_DOCUMENT_NUMBER','ITEM_NUMBER','MATERIAL_NUMBER','DESCRIPTION','DOCUMENT_TYPE','DOCUMENT_DATE','ORDER_QUANTITY','ORDER_DATE','PURCHASE_ORDER_NUMBER','VALID_FROM','VALID_TO','SOLD_TO','NAME','EXCHANGE_RATE','DELIVERED_QUANTITY','BASE_UNIT_MEASUREMENT','NET_PRICE','CONDITION_UNIT','NET_VALUE','DIVISION','DOCUMENT_STATUS','SALES_GROUP','SALES_ORGANIZATION','SALES_UNIT','SHIPPING_POINT','DISTRIBUTION_CHANEL','GOODS_ISSUE_DATE','CURRENCY','PLANT','SALES_UNIT_ISO','CURRENCY_ISO','CUSTOMER_PURCHASE_NUMBER','CREATION_DATE','CREATION_TIME']
  delhead: String[] = ['DELIVERY','CREATED_BY','ENTRY_TIME','RECORD_CREATION_DATE','SHIPPING_POINT','SALES_ORGANIZATION','DELIVERY_TYPE','LOADING_DATE','TRANSPORTATION_PLANNING_DATE','DELIVERY_DATE','PICKING_DATE','DOCUMENT_CATEGORY','DELIVERY_PRIORITY','SHIPPING_CONDITIONS','SHIP_TO_PARTY','SOLD_TO_PARTY','TOTAL_WEIGHT','NET_WEIGHT','WEIGHT_UNIT','WEIGHT_GROUP_DELIVERY','TRANSPORTATION_GROUP','BILLING_DATE','PROCEDURE','DOCUMENT_CURRENCY','COMBINATION_CRITERIA','CHANGED_BY','CHANGED_ON','BILLING_TYPE','DOCUMENT_DATE','GOODS_MOVEMENT_DATE','TIME_ZONE_SENDER','TIME_ZONE_DELIVERY','GOODS_ISSUE_TIME','GOODS_ISSUE_TIMEZONE','RELEASE_TIME_STAMP']
  delitem:String[] = ['DELIVERY','DELIVERY_ITEM','DELIVERY_ITEM_CATEGORY','CREATED_BY','ENTRY_TIME','CREATED_ON','MATERIAL_NUMBER','PLANT','STORAGE_LOCATION','ACTUAL_QUANTITY_DELIVERED','BASE_UNIT_MEASUREMENT','SALES_UNIT','NET_WEIGHT','GROSS_WEIGHT','WEIGHT_UNIT','AVAILABILITY_DATE','QUANTITY_DELIVERED_STOCK','SALES_ORDER_ITEM','DOCUMENT_NUMBER','ITEM_NUMBER','BILLING_RELEVANCE','LOADING_GROUP','TRANSPORTATION_GROUP','MOVEMENT_TYPE','REQUIREMENT_TYPE','PLANNING_TYPE','MATERIAL_TYPE','REQUIREMENT_SUMMARY','AVAILABILITY_CHECK','DISTRIBUTION_CHANEL','DIVISION','CHANGED_ON','DOCUMENT_CATEGORY','PROFIT_CENTER','CONVERSION_FACTOR','REQUIREMENT_CLASS','INSPECTION_LOT_NUMBER','MATERIAL_STAGING_TIME','EXCHANGE_RATE','INSPECTION_OUTCOME','ORIGINAL_DELIVERY_QUANTITY']
  creditem:String[] = ['COMPANY_CODE','ACCOUNTING_DOCUMENT_NUMBER','FISCAL_YEAR','CLEARING_DATE','CLEARING_ENTRY_DATE','CLEARING_DOCUMENT_NUMBER','POSTING_KEY','ACCOUNT_TYPE','AMOUNT_LOCAL_CURRENCY','AMOUNT_DOCUMENT_CURRENCY','AMOUNT_GENERAL_LEDGER','UPDATE_CURRENCY','VALUE_DATE','ITEM_TEXT','TRANSACTION_TYPE','CONTROLLING_AREA','ACCOUNT_NUMBER','GENERAL_LEDGER_ACCOUNT','CUSTOMER_NUMBER','BASELINE_DATE','DISCOUNT_LOCAL_CURRENCY','DISCOUNT_DOCUMENT_CURRENCY','TAX_DISTRIBUTION_AMOUNT','CREDIT_CONTROL_AMOUNT','EXCHANGE_RATE_DIFFERENCE','CREDIT_CONTROL_AREA','FISCAL_YEAR_CLEARING','TAX_DOCUMENT_ITEM','BILLING_PERIOD_BEGIN','BILLING_PERIOD_END','REFERENCE_YEAR']
  debititem:String[] = ['COMPANY_CODE','ACCOUNTING_DOCUMENT_NUMBER','FISCAL_YEAR','CLEARING_DATE','CLEARING_ENTRY_DATE','CLEARING_DOCUMENT_NUMBER','POSTING_KEY','ACCOUNT_TYPE','AMOUNT_LOCAL_CURRENCY','AMOUNT_DOCUMENT_CURRENCY','AMOUNT_GENERAL_LEDGER','UPDATE_CURRENCY','VALUE_DATE','ITEM_TEXT','TRANSACTION_TYPE','CONTROLLING_AREA','ACCOUNT_NUMBER','GENERAL_LEDGER_ACCOUNT','CUSTOMER_NUMBER','BASELINE_DATE','DISCOUNT_LOCAL_CURRENCY','DISCOUNT_DOCUMENT_CURRENCY','TAX_DISTRIBUTION_AMOUNT','CREDIT_CONTROL_AMOUNT','EXCHANGE_RATE_DIFFERENCE','CREDIT_CONTROL_AREA','FISCAL_YEAR_CLEARING','TAX_DOCUMENT_ITEM','BILLING_PERIOD_BEGIN','BILLING_PERIOD_END','REFERENCE_YEAR']
  payitem:String[] = ['COMPANY_CODE','CUSTOMER','FISCAL_YEAR','DOCUMENT_NUMBER','ITEM_NUMBER','POSTING_DATE','DOCUMENT_DATE','ENTRY_DATE','CURRENCY','LOCAL_CURRCY','DOCUMENT_TYPE','FISCAL_PERIOD','POSTING_KEY','DEBIT_CREDIT_INDICATOR','LOCAL_CURRENCY_AMOUNT','AMOUNT_DOCUMENT_CURRENCY','LOCAL_CURRENCY_TAX','DOCUMENT_CURRENCY_TAX','DUE_DAYS','BASELINE_DATE','DISCOUNT_DAYS1','DISCOUNT_DAYS2','SETTLEMENT_PERIOD','DISCOUNT_PERCENTAGE1','DISCOUNT_PERCENTAGE2','BASE_DISCOUNT','INVOICE_REFERENCE','INVOICE_YEAR','INVOICE_ITEM','TRANSLATION_CURRENCY','AMOUNT','NET_AMOUNT','OBJECT_TYPE','REFERENCE_DOCUMENT','REFERENCE_ORGANIZATION_UNIT']
  editform: FormGroup;
  currThemeIndex4:any=0;
  gridTheme4: string='ag-theme-alpine';
  gridTheme3: string='ag-theme-alpine';
  currThemeIndex3: any=0;
  currThemeIndex2: any=0;
  gridTheme2: string='ag-theme-alpine';
  currThemeIndex1: any=0;
  gridTheme1: string='ag-theme-alpine';
  gridTheme5: string='ag-theme-alpine';
  gridTheme6: string='ag-theme-alpine';
  gridTheme7: string='ag-theme-alpine';
  gridTheme8: string='ag-theme-alpine';
  defaultColDef:any;
  currThemeIndex5: any=0;
  currThemeIndex6: any=0;
  currThemeIndex7: any=0;
  currThemeIndex8: any=0;
  paginationPageSize: any;
  domLayout: any;
  paginationNumberFormatter:any;
  constructor(private router: Router, private authService: AuthService, private httpClient: HttpClient,private formBuilder: FormBuilder,private afStorage: AngularFireStorage,private titleService: Title) {
   this.id="";
   this.SideNav = false;
   this.inquirystatus = false;
   this.salesstatus = false;
   this.deliverystatus = false;
   this.creditstatus = false;
   this.debitstatus = false;
   this.editdetails = false;
   this.paymentsstatus = false;
   this.InquiryShow = false;
   this.SalesShow = false;
   this.DeliveryShow = false;
   this.CreditShow = false;
   this.PayShow = false;
   this.DebitShow = false;
   this.ViewDetails = false;
   this.MasterDetails=false;
   this.videoplayer;
   this.editform = this.formBuilder.group({
    FirstName:'',
    LastName:'',
    CustomerNumber:'',
    MobileNumber:'',
    AlternateNumber:'',
    StreetNumber:'',
    City:'',
    District:'',
    Region:'',
    PinCode:'',
    CountryCode:''


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
  else if(op===6){
    this.currThemeIndex6+=1
    if(this.currThemeIndex6%2!=0){
      this.gridTheme6='ag-theme-alpine-dark'
    }
    else if(this.currThemeIndex6%2==0){
      this.gridTheme6='ag-theme-alpine'
    }
  }
  else if(op===7){
    this.currThemeIndex7+=1
    if(this.currThemeIndex7%2!=0){
      this.gridTheme7='ag-theme-alpine-dark'
    }
    else if(this.currThemeIndex7%2==0){
      this.gridTheme7='ag-theme-alpine'
    }
  }
  else if(op===8){
    this.currThemeIndex8+=1
    if(this.currThemeIndex8%2!=0){
      this.gridTheme8='ag-theme-alpine-dark'
    }
    else if(this.currThemeIndex8%2==0){
      this.gridTheme8='ag-theme-alpine'
    }
  }
  }

  ngOnInit() {
    this.count=0;
    this.id = <string>localStorage.getItem('token');
    console.log(this.id);
    this.ViewHome = true;
  }

  @ViewChild("videoPlayer", { static: false }) videoplayer:any;
  isPlay: boolean = false;
  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }
  playPause() {
    var myVideo: any = document.getElementsByClassName("video");
    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
  }

  inquiryData(){
    this.currThemeIndex1=0;
    this.gridTheme1='ag-theme-alpine';
    this.currThemeIndex2=0;
    this.gridTheme2='ag-theme-alpine';
    this.SalesShow = false;
    this.DeliveryShow = false;
    this.CreditShow = false;
    this.PayShow = false;
    this.DebitShow = false;
    this.EditDetails = false;
    this.ViewDetails = false;
    setTimeout(()=>this.InquiryShow=true, 10000);//10sec
    this.salesstatus=false;
    this.inquirystatus=true;
    this.deliverystatus=false;
    this.editdetails=false;
    this.creditstatus=false;
    this.debitstatus=false;
    this.paymentsstatus=false;
    this.ViewHome = false;
    this.id = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
          let custjson = {
            customerid :this.id,
          }
          this.items = this.httpClient.post(this.inq_url,JSON.stringify(custjson), {
            headers: headers
          }).subscribe(
            (data:any) => {
              this.items = data
            })
            this.dynamicallyConfigureColumnsFromObject(this.inqhead)
            this.dynamicallyConfigureColumnsFromObject1(this.inqitem)
            this.defaultColDef = {
              enableRowGroup: true,
              enablePivot: true,
              enableValue: true,
              sortable: true,
              filter: true,
              resizable: true,
              floatingFilter: true,
              minWidth: 1500/(this.inqhead.length),
              suppressSizeToFit: false
            };
            this.domLayout = 'autoHeight';
            this.paginationPageSize = 10;
          this.paginationNumberFormatter = function (params:any) {
            return '[' + params.value.toLocaleString() + ']';
          };

  }

  salesOrder(){
    this.currThemeIndex3=0;
    this.gridTheme3='ag-theme-alpine';
    this.ViewHome = false;
    this.InquiryShow = false;
    this.DeliveryShow = false;
    this.CreditShow = false;
    this.PayShow = false;
    this.DebitShow = false;
    this.EditDetails = false;
    this.ViewDetails = false;
    setTimeout(()=>this.SalesShow=true, 10000);
    this.inquirystatus=false;
    this.salesstatus=true;
    this.deliverystatus=false;
    this.editdetails=false;
    this.creditstatus=false;
    this.debitstatus=false;
    this.paymentsstatus=false;
    this.id = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
          let custjson = {
            customerid :this.id,
          }
          this.sales = this.httpClient.post(this.sales_url,JSON.stringify(custjson), {
            headers: headers
          }).subscribe(
            (data:any) => {
              this.sales = data

            })
           this.dynamicallyConfigureColumnsFromObject(this.salesitem)
            this.defaultColDef = {
              enableRowGroup: true,
              enablePivot: true,
              enableValue: true,
              sortable: true,
              filter: true,
              resizable: true,
              floatingFilter: true,
              minWidth: 1500/(this.salesitem.length),
              suppressSizeToFit: false
            };
            this.domLayout = 'autoHeight';
            this.paginationPageSize = 10;
          this.paginationNumberFormatter = function (params:any) {
            return '[' + params.value.toLocaleString() + ']';
          };
  }


  deliveryData(){
    this.currThemeIndex4=0;
    this.currThemeIndex5=0;
    this.gridTheme4='ag-theme-alpine';
    this.gridTheme5='ag-theme-alpine';
    this.ViewHome = false;
    this.InquiryShow = false;
    this.SalesShow = false;
    this.CreditShow = false;
    this.PayShow = false;
    this.DebitShow = false;
    this.EditDetails = false;
    this.ViewDetails = false;
    setTimeout(()=>this.DeliveryShow=true, 10000);
    this.inquirystatus=false;
    this.salesstatus=false;
    this.deliverystatus=true;
    this.editdetails=false;
    this.creditstatus=false;
    this.debitstatus=false;
    this.paymentsstatus=false;
    this.id = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
          let custjson = {
            customerid :this.id,
          }
          this.delivery = this.httpClient.post(this.del_url,JSON.stringify(custjson), {
            headers: headers
          }).subscribe(
            (data:any) => {
              this.delivery = data
            })
            this.dynamicallyConfigureColumnsFromObject(this.delhead)
            this.dynamicallyConfigureColumnsFromObject1(this.delitem)
            this.defaultColDef = {
              enableRowGroup: true,
              enablePivot: true,
              enableValue: true,
              sortable: true,
              filter: true,
              resizable: true,
              floatingFilter: true,
              minWidth: 1500/(this.delhead.length),
              suppressSizeToFit: false
            };
            this.domLayout = 'autoHeight';
            this.paginationPageSize = 10;
          this.paginationNumberFormatter = function (params:any) {
            return '[' + params.value.toLocaleString() + ']';
          };
  }

  creditData(){
    this.currThemeIndex6=0;
    this.gridTheme6='ag-theme-alpine';
    this.ViewHome = false;
    this.InquiryShow = false;
    this.SalesShow = false;
    this.DeliveryShow = false;
    this.PayShow = false;
    this.DebitShow = false;
    this.EditDetails = false;
    this.ViewDetails = false;
    setTimeout(()=>this.CreditShow=true, 10000);
    this.inquirystatus=false;
    this.salesstatus=false;
    this.deliverystatus=false;
    this.creditstatus=true;
    this.debitstatus=false;
    this.editdetails=false;
    this.paymentsstatus=false;
    this.id = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
          let custjson = {
            customerid :this.id,
          }
          this.credit = this.httpClient.post(this.credit_url,JSON.stringify(custjson), {
            headers: headers
          }).subscribe(
            (data:any) => {
              this.credit = data
            })
            this.dynamicallyConfigureColumnsFromObject(this.creditem)
            this.defaultColDef = {
              enableRowGroup: true,
              enablePivot: true,
              enableValue: true,
              sortable: true,
              filter: true,
              resizable: true,
              floatingFilter: true,
              minWidth: 1500/(this.creditem.length),
              suppressSizeToFit: false
            };
            this.domLayout = 'autoHeight';
            this.paginationPageSize = 10;
          this.paginationNumberFormatter = function (params:any) {
            return '[' + params.value.toLocaleString() + ']';
          };

  }



  debitData(){
    this.currThemeIndex7=0;
    this.gridTheme7='ag-theme-alpine';
    this.ViewHome = false;
    this.InquiryShow = false;
    this.SalesShow = false;
    this.DeliveryShow = false;
    this.PayShow = false;
    this.CreditShow = false;
    this.EditDetails = false;
    this.ViewDetails = false;
    setTimeout(()=>this.DebitShow=true, 10000);
    this.inquirystatus=false;
    this.salesstatus=false;
    this.deliverystatus=false;
    this.creditstatus=false;
    this.debitstatus=true;
    this.editdetails=false;
    this.paymentsstatus=false;
    this.id = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
          let custjson = {
            customerid :this.id,
          }
          this.debit = this.httpClient.post(this.debit_url,JSON.stringify(custjson), {
            headers: headers
          }).subscribe(
            (data:any) => {
              this.debit = data
            })
            this.dynamicallyConfigureColumnsFromObject(this.debititem)
            this.defaultColDef = {
              enableRowGroup: true,
              enablePivot: true,
              enableValue: true,
              sortable: true,
              filter: true,
              resizable: true,
              floatingFilter: true,
              minWidth: 1500/(this.debititem.length),
              suppressSizeToFit: false
            };
            this.domLayout = 'autoHeight';
            this.paginationPageSize = 10;
          this.paginationNumberFormatter = function (params:any) {
            return '[' + params.value.toLocaleString() + ']';
          };
  }

  payments(){
    this.currThemeIndex8=0;
    this.gridTheme8='ag-theme-alpine';
    this.ViewHome = false;
    this.InquiryShow = false;
    this.SalesShow = false;
    this.DeliveryShow = false;
    this.CreditShow = false;
    this.DebitShow = false;
    this.EditDetails = false;
    this.ViewDetails = false;
    setTimeout(()=>this.PayShow=true, 10000);
    this.inquirystatus=false;
    this.salesstatus=false;
    this.deliverystatus=false;
    this.creditstatus=false;
    this.debitstatus=false;
    this.editdetails=false;
    this.paymentsstatus=true;
    this.id = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
          let custjson = {
            customerid :this.id,
          }
          this.payage = this.httpClient.post(this.pay_url,JSON.stringify(custjson), {
            headers: headers
          }).subscribe(
            (data:any) => {
              this.payage = data
            })
            this.dynamicallyConfigureColumnsFromObject(this.payitem)
            this.defaultColDef = {
              enableRowGroup: true,
              enablePivot: true,
              enableValue: true,
              sortable: true,
              filter: true,
              resizable: true,
              floatingFilter: true,
              minWidth: 1500/(this.payitem.length),
              suppressSizeToFit: false
            };
            this.domLayout = 'autoHeight';
            this.paginationPageSize = 10;
          this.paginationNumberFormatter = function (params:any) {
            return '[' + params.value.toLocaleString() + ']';
          };

  }

  onSubmit(){
    this.ViewHome = false;
    this.inquirystatus=false;
    this.salesstatus=false;
    this.deliverystatus=false;
    this.creditstatus=false;
    this.debitstatus=false;
    this.editdetails=true;
    this.paymentsstatus=false;
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

    this.FirstName = this.editform.get('FirstName')?.value;
    this.LastName = this.editform.get('LastName')?.value;
    this.MobileNumber = this.editform.get('MobileNumber')?.value;
    this.AlternateNumber = this.editform.get('AlternateNumber')?.value;
    this.StreetNumber = this.editform.get('StreetNumber')?.value;
    this.City = this.editform.get('City')?.value;
    this.District = this.editform.get('District')?.value;
    this.Region = this.editform.get('Region')?.value;
    this.PinCode = this.editform.get('PinCode')?.value;
    this.CountryCode = this.editform.get('CountryCode')?.value;
    let customerdetails = {
    FirstName:this.FirstName,
    LastName:this.LastName,
    CustomerNumber:this.id,
    MobileNumber:this.MobileNumber,
    AlternateNumber:this.AlternateNumber,
    StreetNumber:this.StreetNumber,
    City:this.City,
    District:this.District,
    Region:this.Region,
    PinCode:this.PinCode,
    CountryCode:this.CountryCode
    }

    this.editcust = this.httpClient.post(this.edit_url,JSON.stringify(customerdetails), {
      headers: headers
    }).subscribe(
      (data:any) => {
        this.editcust = data
      })
      setTimeout(()=>this.EditDetails=true, 10000);
  }
  forminit(){
    this.ViewHome = false;
    this.inquirystatus=false;
    this.salesstatus=false;
    this.deliverystatus=false;
    this.creditstatus=false;
    this.debitstatus=false;
    this.editdetails=true;
    this.paymentsstatus=false;
  }
  home(){
    this.PayShow = false;
    this.InquiryShow = false;
    this.SalesShow = false;
    this.DeliveryShow = false;
    this.CreditShow = false;
    this.DebitShow = false;
    this.EditDetails = false;
    this.ViewDetails = false;
    this.ViewHome = true;
    this.inquirystatus=false;
    this.salesstatus=false;
    this.deliverystatus=false;
    this.creditstatus=false;
    this.debitstatus=false;
    this.editdetails=false;
    this.paymentsstatus=false;
  }
  addfile(event:any)
  {
    this.MasterDetails=true;
  this.file= event.target.files[0];
  let fileReader = new FileReader();
  fileReader.readAsArrayBuffer(this.file);
  fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, {type:"binary"});
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
        var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});
            this.filelist = [];
            arraylist.forEach(element => {
              const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
          this.master = this.httpClient.post(this.master_url,JSON.stringify(element), {
            headers: headers
          }).subscribe(
            (data:any) => {
              this.master = data
              this.filelist.push(data.CUSTOMER)
              console.log(this.filelist)
            })

            });
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
details(){
  this.ViewHome = true;
  this.InquiryShow = false;
  this.SalesShow = false;
  this.DeliveryShow = false;
  this.CreditShow = false;
  this.DebitShow = false;
  this.EditDetails = false;
  this.PayShow = false;
  setTimeout(()=>this.ViewDetails=true, 10000);
  const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
          let custjson = {
            customerid :this.id,
          }
          this.viewdet = this.httpClient.post(this.details_url,JSON.stringify(custjson), {
            headers: headers
          }).subscribe(
            (data:any) => {
              this.viewdet = data
              console.log(data);
            })


}
setTitle(newTitle: string) {
  this.titleService.setTitle(newTitle);
}
CredDeb(){
  this.count=this.count+1;
  if(this.count%2==0){
    this.debitData();
  }
  else if(this.count%2!=0){
    this.creditData();
  }
}
upload(event:any) {
  const randomId = Math.random().toString(36).substring(2);
  this.ref = this.afStorage.ref(randomId);
  this.task = this.ref.put(event.target.files[0]);
  this.uploadProgress = this.task.percentageChanges();
  this.downloadURL = this.task.downloadURL();
}
  logout() {
    console.log('logout');
    this.setTitle('Login');
    this.authService.logout();
    this.router.navigate(['customer-login']);
  }
openside(){
  this.SideNav = true;
}
closeside(){
  this.SideNav = false;
}
}



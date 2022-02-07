import { Component, OnInit, QueryList } from '@angular/core';
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
import * as moment from 'moment';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {
  @ViewChild('agGrid') aGrid!: AgGridAngular;

  PO_Head = new MatTableDataSource();
  PO_Items = new MatTableDataSource();
  RFQ_Head = new MatTableDataSource();
  RFQ_Items = new MatTableDataSource();
  GR_Head = new MatTableDataSource();
  GR_Items = new MatTableDataSource();
  Credit_Items = new MatTableDataSource();
  Debit_Items = new MatTableDataSource();
  Pay_Items = new MatTableDataSource();
  Inv_Disp = new MatTableDataSource();

  @ViewChild('iframe') iframe!: ElementRef

  @ViewChild('MatPaginator1') Matpaginator1!: MatPaginator;
  @ViewChild('MatPaginator2') MatPaginator2!: MatPaginator;
  @ViewChild('MatPaginator3') Matpaginator3!: MatPaginator;
  @ViewChild('MatPaginator4') Matpaginator4!: MatPaginator;
  @ViewChild('MatPaginator5') Matpaginator5!: MatPaginator;
  @ViewChild('MatPaginator6') Matpaginator6!: MatPaginator;
  HeadLength_RFQ = 0;
  ItemsLength_RFQ = 0;
  HeadLength_PO = 0;
  ItemsLength_PO = 0;
  HeadLength_GR = 0;
  ItemsLength_GR = 0;
  ItemsLength_CRED = 0;
  ItemsLength_DEBIT = 0;
  ItemsLength_PAY = 0;
  ItemsLength_INVDISP = 0;
  RFQ_url = 'http://localhost:3100/RFQ';
  PO_url =  'http://localhost:3200/PO';
  GR_url =  'http://localhost:3300/GR';
  Cred_url = 'http://localhost:3400/Vendor-Credit';
  Deb_url = 'http://localhost:3500/Vendor-Debit';
  Pay_url = 'http://localhost:3600/Vendor-Pay';
  details_url = 'http://localhost:3700/Vendor-Details';
  edit_url = 'http://localhost:3800/Vendor-Edit';
  inv_form_url = 'http://localhost:3850/Vendor-InvoiceForm';
  form_path = 'http://localhost:3900/Vendor-Form';
  inv_dis_url = 'http://localhost:3950/Vendor-InvoiceDisplay';
  vendorid:any;
  rfq:any;
  po:any;
  gr:any;
  credit:any;
  debit:any;
  pay:any;
  ViewDetails:any;
  viewdet:any;
  RFQStatus:any;
  POStatus:any;
  GRStatus:any;
  CreditStatus:any;
  DebitStatus:any;
  PayStatus:any;
  RFQShow:any;
  CreditShow:any;
  DebitShow:any;
  POShow:any;
  GRShow:any;
  pdfSrc:string='';
  PayShow:any;
  ViewHome:any;
  InvDispShow:any;
  InvFormShow:any;
  FirstName:string='';
  LastName:string='';
  City:string='';
  District:string='';
  Region:string='';
  Street:string='';
  PostalCode:string='';
  Country:string='';
  Telephone:string='';
  invoiceno:string='';
  fiscalyr:string='';
  EditVendor:any;
  editvendor:any;
  invdisstatus:any;
  invformstatus:any;
  InvDisp:any;
  InvForm:any;
  fileURL:string='';
  service: string='';
  docPath: string='';
  colDefs:ColDef[]=[];
  colDefs1:ColDef[]=[];
  currThemeIndex4:any=0;
  cdcount:any=0;
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
  gridTheme9: string='ag-theme-alpine';
  gridTheme10: string='ag-theme-alpine';
  defaultColDef:any;
  currThemeIndex5: any=0;
  currThemeIndex6: any=0;
  currThemeIndex7: any=0;
  currThemeIndex8: any=0;
  currThemeIndex9: any=0;
  currThemeIndex10:any=0;
  paginationPageSize: any;
  domLayout: any;
  paginationNumberFormatter:any;
  rfqhead : String[] = ['DOCUMENT_NUMBER','COMPANY_CODE','DOCUMENT_TYPE','CREATED_ON','CREATED_BY','ITEM_INTERVAL','LAST_ITEM','VENDOR','LANGUAGE','DISCOUNT1_TO','DISCOUNT2_TO','DISCOUNT3_TO','CASH_DISCOUNT1','CASH_DISCOUNT2','PURCHASE_ORGANIZATION','PURCHASE_GROUP','EXCHANGE_RATE','DOCUMENT_DATE','QUOTATION_DEADLINE','TARGET_VALUE','UPDATE_GROUP','SUBITEMINT','RELEASE_GROUP','RELEASE_STRATEGY','VENDOR_NAME']
  rfqitems : String[] = ['DOCUMENT_NUMBER','DOCUMENT_ITEM','CHANGED_ON','DESCRIPTION','MATERIAL_NUMBER','COMPANY_CODE','MATERIAL_GROUP','TARGET_QUANTITY','QUANTITY','UNIT','NET_PRICE','PRICE_UNIT','NET_VALUE','GROSS_VALUE','QUOTATION_DEADLINE','GOODS_RECEIPT_PROCESSING_TIME','BASE_UNIT','UPDATE_GROUP','NET_WEIGHT','GROSS_WEIGHT','VOLUME','RFQ_ITEM','MATERIAL_TYPE','ORDER_UNIT_ISO','BASE_UOM_ISO']
  pohead : String[] = ['PURCHASE_ORDER_NUMBER','COMPANY_CODE','DOCUMENT_TYPE','STATUS','CREATED_ON','CREATED_BY','ITEM_INTERVAL','LAST_ITEM','VENDOR','LANGUAGE','PURCHASE_ORGANIZATION', 'PURCHASE_GROUP','CURRENCY','EXCHANGE_RATE','DOCUMENT_DATE','TARGET_VALUE','DOCUMENT_CONDITION','PROCEDURE','UPDATE_GROUP','RELEASE_GROUP','RELEASE_STRATEGY','RELEASE_INDICATOR','RELEASE_STATUS','TAX_RETURN_COUNTRY','VENDOR_NAME','CURRENCY_ISO','EXCHANGE_RATE_QUOTED']
  poitems : String[] = ['PURCHASE_ORDER_NUMBER','PURCHASE_ORDER_ITEM','CHANGED_ON','DESCRIPTION','MATERIAL_NUMBER','COMPANY_CODE','PLANT','MATERIAL_GROUP','INFO_RECORD','QUANTITY','UNIT','ORDER_PRICE_UNIT','NET_PRICE','PRICE_UNIT','NET_VALUE','GROSS_VALUE','INFO_UPDATE','ITEM_CATEGORY','PRICE_DATE','EFFECTIVE_VALUE','UPDATE_GROUP','PURCHASE_REQUISITION_ITEM','MATERIAL_TYPE','PO_UNIT_ISO']
  grhead : String[] = [ 'MATERIAL_DOCUMENT_NUMBER','DOCUMENT_YEAR','EVENT_TYPE','DOCUMENT_DATE','POSTING_DATE','ENTRY_DATE','ENTRY_TIME','USERNAME','VERSION_GOODS_RECEIPT']
  gritems : String[] = ['MATERIAL_DOCUMENT_NUMBER','DOCUMENT_YEAR','MATERIAL_DOCUMENT_ITEM','MATERIAL','PLANT','MOVEMENT_TYPE','SPECIAL_STOCK_INDICATOR','VENDOR','SALES_ORDER_ITEM','ENTRY_QUANTITY','ENTRY_UOM','QUANTITY_PURCHASE_ORDER','PURCHASE_ORDER_NUMBER','PURCHASE_ORDER_ITEM','COST_CENTER','ORDER_ITEM_NUMBER','REASON_FOR_MOVEMENT','AMOUNT_LOCAL_CURRENCY','AMOUNT_LOCAL_CURRENCY_EXTERNAL','CURRENCY','CURRENCY_ISO','REFERENCE_DOCUMENT_YEAR','DOCUMENT_LINE_ID','DOCUMENT_PARENT_ID','LINE_DEPTH','EARMARKED_ITEM']
  credititem : String[] = ['COMPANY_CODE','ACCOUNTING_DOCUMENT_NUMBER','FISCAL_YEAR','ACCOUNTING_LINE_ITEM_NUMBER','LINE_ITEM_IDENTIFICATION','POSTING_KEY','ACCOUNT_TYPE','DEBIT_CREDIT_INDICATOR','LOCAL_CURRENCY_AMOUNT','DOCUMENT_CURRENCY_AMOUNT','REDUCTION_AMOUNT','GENERAL_LEDGER_AMOUNT','UPDATE_CURRENCY','TRANSACTION_KEY','TRANSACTION_TYPE','CONTROLLING_AREA','GENERAL_LEDGER_ACCOUNT','VENDOR_ID','BALANCE_SHEET_ACCOUNT_INDICATOR','MATERIAL_NUMBER','PLANT','QUANTITY','UNIT_OF_MEASUREMENT','QUANTITY_IN_UNIT','UNIT_OF_ENTRY','ORDER_PRICE_UNIT','PURCHASING_DOCUMENT_NUMBER','DOCUMENT_ITEM_NUMBER','PRICE_CONTROL_INDICATOR','VALUATION_AREA','VALUATION_TYPE']
  debititem : String[] = ['COMPANY_CODE','ACCOUNTING_DOCUMENT_NUMBER','FISCAL_YEAR','ACCOUNTING_LINE_ITEM_NUMBER','LINE_ITEM_IDENTIFICATION','POSTING_KEY','ACCOUNT_TYPE','DEBIT_CREDIT_INDICATOR','LOCAL_CURRENCY_AMOUNT','DOCUMENT_CURRENCY_AMOUNT','REDUCTION_AMOUNT','GENERAL_LEDGER_AMOUNT','UPDATE_CURRENCY','TRANSACTION_KEY','TRANSACTION_TYPE','CONTROLLING_AREA','GENERAL_LEDGER_ACCOUNT','VENDOR_ID','BALANCE_SHEET_ACCOUNT_INDICATOR','MATERIAL_NUMBER','PLANT','QUANTITY','UNIT_OF_MEASUREMENT','QUANTITY_IN_UNIT','UNIT_OF_ENTRY','ORDER_PRICE_UNIT','PURCHASING_DOCUMENT_NUMBER','DOCUMENT_ITEM_NUMBER','PRICE_CONTROL_INDICATOR','VALUATION_AREA','VALUATION_TYPE']
  payitem : String[] = ['COMPANY_CODE','VENDOR','CLEARING_DOCUMENT_NUMBER','FISCAL_YEAR','DOCUMENT_NUMBER','ITEM_NUMBER','POSTING_DATE','DOCUMENT_DATE','ENTRY_DATE','CURRENCY','LOCAL_CURRENCY','DOCUMENT_TYPE','FISCAL_PERIOD','POSTING_KEY','DEBIT_CREDIT_INDICATOR','TAX_SALES_CODE','AMOUNT_LOCAL_CURRENCY','AMOUNT_DOCUMENT_CURRENCY','BASELINE_DATE','DISCOUNT_BASE_AMOUNT','TRANSLATION_CURRENCY','AMOUNT','OBJECT_TYPE','REFERENCE_DOCUMENT_NUMBER','REF_ORGANISATIONAL_UNIT']
  invoiceitem : String[] = ['INVOICE_DOCUMENT_NUMBER','FISCAL_YEAR','POSTNG_DATE','DOCUMENT_DATE','ENTRY_DATE','ENTRY_TIME','COMPANY_CODE','GROSS_AMOUNT','CURRENCY','CURRENCY_ISO','DIFFERENT_INVOICING_PARTY','INVOICE_STATUS']
  editform: FormGroup;
  InvoiceForm:FormGroup;
  op: string='';
  urlSafe: any;
  formddisp: any;

  constructor(private router: Router, private authService: AuthService,private httpClient: HttpClient,private formBuilder: FormBuilder,public sanitizer: DomSanitizer,private titleService: Title) {
    this.vendorid='';
    this.RFQStatus=false;
    this.RFQShow=false;
    this.POStatus=false;
    this.POShow=false;
    this.CreditShow=false;
    this.CreditStatus=false;
    this.DebitShow=false;
    this.DebitStatus=false;
    this.GRStatus=false;
    this.GRShow=false;
    this.PayStatus=false;
    this.PayShow=false;
    this.EditVendor=false;
    this.ViewDetails=false;
    this.invdisstatus=false;
    this.invformstatus=false;
    this.InvDispShow=false;
    this.InvFormShow=false;
    this.fileURL='';
    this.formddisp=false;

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
    this.InvoiceForm = this.formBuilder.group({

      invoiceno:'',
      fiscalyr:''
    });

   }

  ngOnInit(): void {
    this.ViewHome=true;
    this.vendorid = <string>localStorage.getItem('token');
    this.setTitle('Vendor Portal Dashboard')
    console.log(this.vendorid);
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
  else if(op===9){
    this.currThemeIndex9+=1
    if(this.currThemeIndex9%2!=0){
      this.gridTheme9='ag-theme-alpine-dark'
    }
    else if(this.currThemeIndex9%2==0){
      this.gridTheme9='ag-theme-alpine'
    }
  }
  else if(op===10){
    this.currThemeIndex10+=1
    if(this.currThemeIndex10%2!=0){
      this.gridTheme10='ag-theme-alpine-dark'
    }
    else if(this.currThemeIndex10%2==0){
      this.gridTheme10='ag-theme-alpine'
    }
  }
  }

  RFQ(){
    this.currThemeIndex1=0;
    this.gridTheme1='ag-theme-alpine';
    this.currThemeIndex2=0;
    this.gridTheme2='ag-theme-alpine';
    this.RFQStatus=true;
    this.formddisp=false;
    this.invdisstatus=false;
    this.invformstatus=false;
    this.InvDispShow=false;
    this.InvFormShow=false;
    this.CreditStatus=false;
    this.CreditShow=false;
    this.DebitShow=false;
    this.DebitStatus=false;
    this.POStatus=false;
    this.GRStatus=false;
    this.POShow=false;
    this.GRShow=false;
    this.ViewDetails=false;
    this.ViewHome=false;
    this.EditVendor=false;
    setTimeout(()=>this.RFQShow=true, 10000);
    this.vendorid = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let vendorjson = {
      vendorid :this.vendorid,
    }
    this.rfq = this.httpClient.post(this.RFQ_url,JSON.stringify(vendorjson), {
      headers: headers
    }).subscribe(
      (data:any) => {
        this.rfq = data

      })
      this.dynamicallyConfigureColumnsFromObject(this.rfqhead)
      this.dynamicallyConfigureColumnsFromObject1(this.rfqitems)
      this.defaultColDef = {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true,
        minWidth: 1500/(this.rfqhead.length),
        suppressSizeToFit: false
      };
      this.domLayout = 'autoHeight';
      this.paginationPageSize = 10;
    this.paginationNumberFormatter = function (params:any) {
      return '[' + params.value.toLocaleString() + ']';
    };
  }

  PO(){
    this.currThemeIndex3=0;
    this.gridTheme3='ag-theme-alpine';
    this.currThemeIndex4=0;
    this.gridTheme4='ag-theme-alpine';
    this.POStatus=true;
    this.formddisp=false;
    this.invdisstatus=false;
    this.invformstatus=false;
    this.InvDispShow=false;
    this.InvFormShow=false;
    this.RFQStatus=false;
    this.RFQShow=false;
    this.GRStatus=false;
    this.GRShow=false;
    this.CreditStatus=false;
    this.CreditShow=false;
    this.DebitShow=false;
    this.DebitStatus=false;
    this.ViewDetails=false;
    this.ViewHome=false;
    this.EditVendor=false;
    setTimeout(()=>this.POShow=true, 20000);
    this.vendorid = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let vendorjson = {
      vendorid :this.vendorid,
    }
    this.po = this.httpClient.post(this.PO_url,JSON.stringify(vendorjson), {
      headers: headers
    }).subscribe(
      (data:any) => {
        this.po = data

      })
      this.dynamicallyConfigureColumnsFromObject(this.pohead)
      this.dynamicallyConfigureColumnsFromObject1(this.poitems)
      this.defaultColDef = {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true,
        minWidth: 1500/(this.pohead.length),
        suppressSizeToFit: false
      };
      this.domLayout = 'autoHeight';
      this.paginationPageSize = 10;
    this.paginationNumberFormatter = function (params:any) {
      return '[' + params.value.toLocaleString() + ']';
    };
  }
  GR(){
    this.currThemeIndex5=0;
    this.gridTheme5='ag-theme-alpine';
    this.currThemeIndex6=0;
    this.gridTheme6='ag-theme-alpine';
    this.GRStatus=true;
    this.formddisp=false;
    this.invdisstatus=false;
    this.invformstatus=false;
    this.InvDispShow=false;
    this.InvFormShow=false;
    this.POStatus=false;
    this.RFQStatus=false;
    this.RFQShow=false;
    this.POShow=false;
    this.CreditStatus=false;
    this.CreditShow=false;
    this.DebitShow=false;
    this.DebitStatus=false;
    this.ViewDetails=false;
    this.ViewHome=false;
    this.EditVendor=false;
    setTimeout(()=>this.GRShow=true, 25000);
    this.vendorid = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let vendorjson = {
      vendorid :this.vendorid,
    }
    this.gr = this.httpClient.post(this.GR_url,JSON.stringify(vendorjson), {
      headers: headers
    }).subscribe(
      (data:any) => {
        this.gr = data
        this.GR_Head.data = data['HEAD']
        this.HeadLength_GR = data['HEAD'].length;
        this.GR_Head.paginator = this.Matpaginator1
        this.GR_Items.data = data['ITEMS']
        this.ItemsLength_GR = data['ITEMS'].length;
        this.GR_Items.paginator = this.MatPaginator2;
      })
      this.dynamicallyConfigureColumnsFromObject(this.grhead)
      this.dynamicallyConfigureColumnsFromObject1(this.gritems)
      this.defaultColDef = {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true,
        minWidth: 1500/(this.grhead.length),
        suppressSizeToFit: false
      };
      this.domLayout = 'autoHeight';
      this.paginationPageSize = 10;
    this.paginationNumberFormatter = function (params:any) {
      return '[' + params.value.toLocaleString() + ']';
    };

  }

  CRED(){
    this.currThemeIndex7=0;
    this.gridTheme7='ag-theme-alpine';
    this.GRStatus=false;
    this.formddisp=false;
    this.invdisstatus=false;
    this.invformstatus=false;
    this.InvDispShow=false;
    this.InvFormShow=false;
    this.POStatus=false;
    this.RFQStatus=false;
    this.RFQShow=false;
    this.POShow=false;
    this.CreditStatus=true;
    this.DebitShow=false;
    this.DebitStatus=false;
    this.PayStatus=false;
    this.PayShow=false;
    this.ViewDetails=false;
    this.ViewHome=false;
    this.EditVendor=false;
    setTimeout(()=>this.CreditShow=true, 10000);
    this.vendorid = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let vendorjson = {
      vendorid :this.vendorid,
    }
    this.credit = this.httpClient.post(this.Cred_url,JSON.stringify(vendorjson), {
      headers: headers
    }).subscribe(
      (data:any) => {
        this.credit = data
      })
      this.dynamicallyConfigureColumnsFromObject(this.credititem)
      this.defaultColDef = {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true,
        minWidth: 1500/(this.credititem.length),
        suppressSizeToFit: false
      };
      this.domLayout = 'autoHeight';
      this.paginationPageSize = 10;
    this.paginationNumberFormatter = function (params:any) {
      return '[' + params.value.toLocaleString() + ']';
    };
  }

  DEBIT(){
    this.currThemeIndex8=0;
    this.gridTheme8='ag-theme-alpine';
      this.GRStatus=false;
      this.formddisp=false;
      this.invdisstatus=false;
      this.invformstatus=false;
      this.InvDispShow=false;
      this.InvFormShow=false;
      this.POStatus=false;
      this.RFQStatus=false;
      this.RFQShow=false;
      this.POShow=false;
      this.CreditStatus=false;
      this.CreditShow=false;
      this.DebitStatus=true;
      this.PayStatus=false;
      this.PayShow=false;
      this.ViewDetails=false;
      this.ViewHome=false;
      this.EditVendor=false;
      setTimeout(()=>this.DebitShow=true, 10000);
      this.vendorid = <string>localStorage.getItem('token');
      const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
      let vendorjson = {
        vendorid :this.vendorid,
      }
      this.debit = this.httpClient.post(this.Deb_url,JSON.stringify(vendorjson), {
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

  PAY(){
    this.currThemeIndex9=0;
    this.gridTheme9='ag-theme-alpine';
    this.GRStatus=false;
    this.formddisp=false;
    this.invdisstatus=false;
    this.invformstatus=false;
    this.InvDispShow=false;
    this.InvFormShow=false;
    this.POStatus=false;
    this.RFQStatus=false;
    this.RFQShow=false;
    this.POShow=false;
    this.CreditStatus=false;
    this.CreditShow=false;
    this.DebitStatus=false;
    this.DebitShow=false;
    this.PayStatus=true;
    this.ViewDetails=false;
    this.ViewHome=false;
    this.EditVendor=false;
    setTimeout(()=>this.PayShow=true, 10000);
    this.vendorid = <string>localStorage.getItem('token');
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let vendorjson = {
      vendorid :this.vendorid,
    }
    this.pay = this.httpClient.post(this.Pay_url,JSON.stringify(vendorjson), {
      headers: headers
    }).subscribe(
      (data:any) => {
        this.pay = data
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

InvoiceDisplay(){
  this.currThemeIndex10=0;
  this.gridTheme10='ag-theme-alpine';
  this.invdisstatus=true;
  this.formddisp=false;
  this.RFQStatus=false;
  this.CreditStatus=false;
  this.CreditShow=false;
  this.DebitShow=false;
  this.PayShow=false;
  this.DebitStatus=false;
  this.POStatus=false;
  this.GRStatus=false;
  this.POShow=false;
  this.GRShow=false;
  this.PayStatus=false;
  this.ViewDetails=false;
  this.ViewHome=false;
  this.EditVendor=false;
  setTimeout(()=>this.InvDispShow=true, 10000);
  this.vendorid = <string>localStorage.getItem('token');
  const headers = new HttpHeaders()
  .set('Content-Type', 'application/json');
  let vendorjson = {
    vendorid :this.vendorid,
  }
  this.InvDisp = this.httpClient.post(this.inv_dis_url,JSON.stringify(vendorjson), {
    headers: headers
  }).subscribe(
    (data:any) => {
      this.InvDisp = data
      console.log(data['INVDISP'])
    })
    this.dynamicallyConfigureColumnsFromObject(this.invoiceitem)
    this.defaultColDef = {
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: true,
      minWidth: 1500/(this.invoiceitem.length),
      suppressSizeToFit: false
    };
    this.domLayout = 'autoHeight';
    this.paginationPageSize = 10;
  this.paginationNumberFormatter = function (params:any) {
    return '[' + params.value.toLocaleString() + ']';
  };
}

CredDeb(){
  this.cdcount=this.cdcount+1;
  if(this.cdcount%2==0){
    this.DEBIT();
  }
  else if(this.cdcount%2!=0){
    this.CRED();
  }
}
VendorDetails(){
  this.RFQStatus=false;
  this.RFQShow=false;
  this.POStatus=false;
  this.POShow=false;
  this.formddisp=false;
  this.invdisstatus=false;
  this.invformstatus=false;
  this.InvDispShow=false;
  this.InvFormShow=false;
  this.CreditShow=false;
  this.CreditStatus=false;
  this.DebitShow=false;
  this.DebitStatus=false;
  this.GRStatus=false;
  this.GRShow=false;
  this.PayStatus=false;
  this.PayShow=false;
  this.ViewHome=true;
  this.EditVendor=false;
  setTimeout(()=>this.ViewDetails=true, 10000);
  const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
          let vendorjson = {
            vendorid :this.vendorid,
          }
          this.viewdet = this.httpClient.post(this.details_url,JSON.stringify(vendorjson), {
            headers: headers
          }).subscribe(
            (data:any) => {
              this.viewdet = data
              console.log(data);
            })

}
Home(){
  this.RFQStatus=false;
  this.RFQShow=false;
  this.POStatus=false;
  this.POShow=false;
  this.formddisp=false;
  this.invdisstatus=false;
  this.invformstatus=false;
  this.InvDispShow=false;
  this.InvFormShow=false;
  this.CreditShow=false;
  this.CreditStatus=false;
  this.DebitShow=false;
  this.DebitStatus=false;
  this.GRStatus=false;
  this.GRShow=false;
  this.PayStatus=false;
  this.PayShow=false;
  this.ViewDetails=false;
  this.ViewHome=true;
  this.EditVendor=false;
  this.InvFormShow=false;
}

EditDetails(){
  this.RFQStatus=false;
  this.RFQShow=false;
  this.POStatus=false;
  this.POShow=false;
  this.formddisp=false;
  this.invdisstatus=false;
  this.invformstatus=false;
  this.InvDispShow=false;
  this.InvFormShow=false;
  this.CreditShow=false;
  this.CreditStatus=false;
  this.DebitShow=false;
  this.DebitStatus=false;
  this.GRStatus=false;
  this.GRShow=false;
  this.PayStatus=false;
  this.PayShow=false;
  this.formddisp=false;
  this.ViewDetails=false;
  this.ViewHome=true;
  const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

    this.FirstName = this.editform.get('FirstName')?.value;
    this.LastName = this.editform.get('LastName')?.value;
    this.Telephone = this.editform.get('Telephone')?.value;
    this.Street = this.editform.get('Street')?.value;
    this.City = this.editform.get('City')?.value;
    this.District = this.editform.get('District')?.value;
    this.Region = this.editform.get('Region')?.value;
    this.PostalCode = this.editform.get('PostalCode')?.value;
    this.Country = this.editform.get('Country')?.value;
    let vendordetails = {
    vendorid:this.vendorid,
    FirstName:this.FirstName,
    LastName:this.LastName,
    Telephone:this.Telephone,
    Street:this.Street,
    City:this.City,
    District:this.District,
    Region:this.Region,
    PostalCode:this.PostalCode,
    Country:this.Country
    }
    this.editvendor = this.httpClient.post(this.edit_url,JSON.stringify(vendordetails), {
      headers: headers
    }).subscribe(
      (data:any) => {
        this.editvendor = data
      })
      setTimeout(()=>this.EditVendor=true, 10000);

}

InvoiceView(){
  this.RFQStatus=false;
  this.RFQShow=false;
  this.POStatus=false;
  this.POShow=false;
  this.CreditShow=false;
  this.CreditStatus=false;
  this.DebitShow=false;
  this.DebitStatus=false;
  this.GRStatus=false;
  this.GRShow=false;
  this.PayStatus=false;
  this.PayShow=false;
  this.EditVendor=false;
  this.ViewDetails=false;
  this.invdisstatus=false;
  this.invformstatus=true;
  this.InvDispShow=false;
  this.formddisp=false;

  const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

    this.invoiceno = this.InvoiceForm.get('invoiceno')?.value;
    this.fiscalyr = this.InvoiceForm.get('fiscalyr')?.value;
    let invoicedetails = {
      vendorid:this.vendorid,
      invoiceno:this.invoiceno,
      fiscalyr:this.fiscalyr,
    }
    this.InvForm = this.httpClient.post(this.inv_form_url,JSON.stringify(invoicedetails), {
      headers: headers
    }).subscribe(
      (data:any) => {

          const linkSource = 'data:application/pdf;base64,' + data['FORM']
          const downloadLink = document.createElement("a");
          const fileName = this.invoiceno+'.pdf';


          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          console.log(downloadLink)
          downloadLink.click();
          this.fileURL = 'assets/'+ fileName

          localStorage.setItem("Invoice",this.fileURL);
          console.log(this.fileURL)
          setTimeout(() => {
            let InvoicePath = {
              fileName:fileName
             }
             const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');


            alert('Invoice Form Generated!')

            this.httpClient.post(this.form_path,JSON.stringify(InvoicePath), {
              headers: headers
            }).subscribe((data:any)=>{
              console.log(data)
            })

          }, 2000);


      })



  }
  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
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
  FormDisplay(){
    this.fileURL = <string>localStorage.getItem('Invoice');
    console.log(this.fileURL)
    if(this.fileURL===null){
      this.formddisp=false;
      alert('Invoice Does Not Exist')
      this.InvFormShow=false;
    }
    else{
      this.ViewHome=false;
      this.formddisp=true;

    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.fileURL);

    setTimeout(() => {
      this.InvFormShow=true;
    }, 4000);
  }

    //this.form_src.nativeElement.innerHTML.src=this.op

  }



  logout() {
    console.log('logout');
    localStorage.clear();
    this.setTitle('Login');
    this.authService.logout();
    this.router.navigate(['/vendor-login']);
  }

}

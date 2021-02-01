import { Component, OnInit } from '@angular/core';
import {BreadCrumbItem} from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { SupplierService } from '../../shared/services/suppliers.service';
import { BaseObject } from '../../shared/data/base-object.model';
import { SystemParameterDTO } from '../../../shared/models/system-parameter.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddEditSupplier } from '../../shared/data/add-edit-supplier.model';
import { forEach } from '@angular/router/src/utils/collection';
import { ActivatedRoute, Router } from '@angular/router';
import { FullRoutes } from '../../../../../infrastructure/data/enums/angular-full-routes.enum';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as $ from "jquery";
import { AlertInput } from '../../../../../shared/alerts/alert-input';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss'],
  providers:[SupplierService]
})
export class AddSupplierComponent implements OnInit {
 
  FullRoutes: typeof FullRoutes = FullRoutes;
  breadCrumbItems: BreadCrumbItem[] = [
    {url:'', label:'sideNav.suppliersManagement.title'},
    {url:'', label:'sideNav.suppliersManagement.addSupplier'}
  ];
  addEditForm: FormGroup;
    fileName: string;
  dealingNaturity:BaseObject[];
  countries:BaseObject[];
  cites: BaseObject[];
  areas: BaseObject[];
  paymentCondition: BaseObject[];
  autoCoding: string;
  attchement: File;
  addEditModel: AddEditSupplier;
  alertInput: AlertInput = new AlertInput();
  imageSrc: string = '/assets/images/icons/thumbnail.jpg';
  constructor(private supplierService:SupplierService,private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private ngxService: NgxUiLoaderService) {
    this.getSystemCoding();
   }


  ngOnInit() {
    $(document).ready(function(){
	
      // Variables
      var clickedTab = $(".tabs > .active");
      var tabWrapper = $(".tab__content");
      var activeTab = tabWrapper.find(".active");
      var activeTabHeight = activeTab.outerHeight();
      
      // Show tab on page load
      activeTab.show();
      
      // Set height of wrapper on page load
      tabWrapper.height(activeTabHeight);
      
      $(".tabs > li").on("click", function() {
        
        // Remove class from active tab
        $(".tabs > li").removeClass("active");
        
        // Add class active to clicked tab
        $(this).addClass("active");
        
        // Update clickedTab variable
        clickedTab = $(".tabs .active");
        
        // fade out active tab
        activeTab.fadeOut(250, function() {
          
          // Remove active class all tabs
          $(".tab__content > li").removeClass("active");
          
          // Get index of clicked tab
          var clickedTabIndex = clickedTab.index();
    
          // Add class active to corresponding tab
          $(".tab__content > li").eq(clickedTabIndex).addClass("active");
          
          // update new active tab
          activeTab = $(".tab__content > .active");
          
          // Update variable
          activeTabHeight = activeTab.outerHeight();
          
          // Animate height of wrapper to new tab height
          tabWrapper.stop().delay(50).animate({
            height: activeTabHeight
          }, 500, function() {
            
            // Fade in active tab
            activeTab.delay(50).fadeIn(250);
            
          });
        });
      });
      
    
    });
    this.activatedRoute.params.subscribe(params => {
      if(params["id"]!=undefined)
      this.findbyId(params["id"]);
    });
    this.buildForm();
    this.getCountries();
    this.getdealingNaturity();
    this.getpaymentCondition();
   
  }
  clearForm()
  {
    this.addEditForm.reset({status:1,dealingNaturityId:"wholesale",customerSupplier:false});
  }
  AddEditRest(){
    if(this.addEditForm.valid){
      this.ngxService.startBackground();
     // const formData: FormData = new FormData();
 /*      this.addEditModel = Object.assign({}, this.addEditForm.value);
        for(let property in  this.addEditModel ) 
       { 
         if(this.addEditForm.controls[property].value!=null)
          formData.append(property,this.addEditForm.controls[property].value);
       }  */
  
/*      if(this.attchement!=null)
       formData.append('file',this.attchement,this.attchement.name); */
        this.supplierService.addEdit(this.addEditForm.value).subscribe(res=> {
          this.clearForm();
          this.ngxService.stopBackground();
          this.alertInput = new AlertInput("s", "shared.savedsuccess");
        }, error => {
          this.ngxService.stopBackground();
          if(error.status==412)
          this.alertInput =new AlertInput('ff', error.error);
          else
          this.alertInput = new AlertInput("f", "error.error500");
        });
        
      }else{
        this.fireValidation(this.addEditForm);
      }
  }
  buildForm(){
    this.addEditForm = this.formBuilder.group({
      id: [null],
      code: [null],
      nameAr: [null,[Validators.required,Validators.maxLength(100)]],
      nameEn: [null,[Validators.maxLength(100)]],
      status: [1,Validators.required],
      dealingNaturityId: ["wholesale",Validators.required],
      taxNumber: [null,[Validators.min(0)]],
      countryId: [null],
      cityId: [null],
      areaId: [null],
      address: [null,[Validators.maxLength(200)]],
      phone: [null,[Validators.maxLength(100)]],
      mobile: [null,[Validators.required,Validators.maxLength(100)]],
      fax: [null,[Validators.maxLength(100)]],
      email: [null,[Validators.maxLength(100)]],
      website: [null,[Validators.maxLength(100)]],
      debtor: [null],
      amount: [null,[Validators.min(0)]],
      notes: [null,[Validators.maxLength(200)]],
      supplier: [null],
      creditLimit: [null,[Validators.min(0)]],
      creditDays: [null,[Validators.min(0)]],
      discountPercentage: [null,[Validators.min(0)]],
      achievementConditionId: [null],
      customerSupplier: [false],
      creditLimitPurchase: [null],
      creditDaysPurchase: [null],
      discountPercentagePurchase: [null],
      paymentConditionIdPurchase: [null],
      file:[null],
      creditLimitationId:[null],
      reditLimitationPurchaseId:[null],
      nameRepeate: [null],
      fileExtention: [null]
    });
  }
  
  uploadImage(e) {

    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.fileName = file.name;
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    let base64 = this.imageSrc.split(';base64,')[1];
    let fileExtention = this.imageSrc.split(';base64,')[0].split('data:image/')[1];
    this.addEditForm.get('fileExtention').setValue(fileExtention);
    debugger
    this.addEditForm.get('file').patchValue(base64);
    this.addEditForm.controls["file"].patchValue(base64);
  }

  removeAttachment() {
    this.addEditForm.get('file').patchValue("");
    this.attchement = null;
    this.fileName = null;
    this.imageSrc = '/assets/images/icons/thumbnail.jpg';
    // this.attchement =; //null;
  }
  updateForm()
  {
   let ff= this.addEditForm.get('customerSupplier').value;
    if(this.addEditForm.get('customerSupplier').value==true)
    this.addEditForm.get('paymentConditionIdPurchase').disable();
    else
    this.addEditForm.get('paymentConditionIdPurchase').enable();
  }
  handleFileInput(event){
    for (let file of event) {
      this.attchement = file;
      this.fileName = this.attchement.name;
    }
  }
  addEdit(){
   
 if(this.addEditForm.valid){
  this.ngxService.startBackground();
   // const formData: FormData = new FormData();
/*     this.addEditModel = Object.assign({}, this.addEditForm.value);
      for(let property in  this.addEditModel ) 
     { 
       if(this.addEditForm.controls[property].value!=null)
        formData.append(property,this.addEditForm.controls[property].value);
     }  */

  /*  if(this.attchement!=null)
     formData.append('file',this.attchement,this.attchement.name); */
     
      this.supplierService.addEdit(this.addEditForm.value).subscribe(res=> {
        //this.router.navigate(['/'+FullRoutes.STOCK_MODULE+'/'+FullRoutes.SUPPLIER_MODULE+'/'+FullRoutes.SUPPLIER_LIST]); 
        this.ngxService.stopBackground();
        this.alertInput = new AlertInput("s", "shared.savedsuccess");
      }, error => {
        this.ngxService.stopBackground();
        if(error.status==412)
        this.alertInput =new AlertInput('ff', error.error);
        else
        this.alertInput = new AlertInput("f", "error.error500");
      });
      
    }else{
      this.fireValidation(this.addEditForm);
    } 
  }
  cancal(){
    this.router.navigate(['/'+FullRoutes.PURCHASES_MODULE+'/'+FullRoutes.SUPPLIER_MODULE+'/'+FullRoutes.SUPPLIER_LIST]);
  }
  findbyId(id)
  {
    this.ngxService.start();
    this.supplierService.findById(id)
    .subscribe((res: AddEditSupplier) => {
      this.addEditModel = res;
      this.imageSrc = res.image;
      this.fileName = res.imageName;
      this.addEditForm.patchValue(this.addEditModel);
      this.getCites(this.addEditModel.countryId);
      this.getAreas(this.addEditModel.cityId);
      this.ngxService.stop();
      this.addEditForm.get('paymentConditionIdPurchase').enable();
    }, error => {
      this.alertInput = new AlertInput("f", "error.error500");
    });
  }
  fireValidation(formGroup: FormGroup){
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.fireValidation(control);
      }
    });
  }
  customerSupplier(event)
  {
    
    if(event==true){
      this.addEditForm.get('creditLimitPurchase').setValidators([Validators.required,Validators.min(0)]);
      this.addEditForm.get('creditLimitPurchase').updateValueAndValidity();
      this.addEditForm.get('creditDaysPurchase').setValidators([Validators.required,Validators.min(0)]);
      this.addEditForm.get('creditDaysPurchase').updateValueAndValidity();
      this.addEditForm.get('discountPercentagePurchase').setValidators([Validators.required,Validators.min(0)]);
      this.addEditForm.get('discountPercentagePurchase').updateValueAndValidity();
      this.addEditForm.get('paymentConditionIdPurchase').setValidators(Validators.required);
      this.addEditForm.get('paymentConditionIdPurchase').updateValueAndValidity();
      this.addEditForm.updateValueAndValidity();
    }
    else{
      this.addEditForm.get('creditLimitPurchase').clearValidators();
      this.addEditForm.get('creditDaysPurchase').clearValidators();
      this.addEditForm.get('discountPercentagePurchase').clearValidators();
      this.addEditForm.get('paymentConditionIdPurchase').clearValidators();
    }
  }
  getdealingNaturity() {
    this.supplierService.getLookup('dealingNaturity')
      .subscribe((res: BaseObject[]) => {
        this.dealingNaturity = res;
        // this.distributors = res;
         console.log(res)
      }, error => {
       
      });
  }
  getCountries() {
    this.supplierService.getLookup('country')
      .subscribe((res: BaseObject[]) => {
        this.countries = res;
        // this.distributors = res;
        // console.log(res)
      }, error => {
       
      });
  }
  getCites(parentId) {
  

    this.supplierService.getByParent(parentId)
      .subscribe((res: BaseObject[]) => {
        this.cites = res;
        // this.distributors = res;
        // console.log(res)
      }, error => {
        
      });
  }
  getAreas(parentId) {
    this.supplierService.getByParent(parentId)
      .subscribe((res: BaseObject[]) => {
        this.areas = res;
        // this.distributors = res;
        // console.log(res)
      }, error => {
     
      });
  }
  getpaymentCondition() {
    this.supplierService.getLookup('paymentCondition')
      .subscribe((res: BaseObject[]) => {
        this.paymentCondition = res;
        // this.distributors = res;
        // console.log(res)
      }, error => {
      
      });
  }
  getSystemCoding() {
    this.supplierService.getSystemParameter('systemCoding')
      .subscribe((res: SystemParameterDTO) => {
        this.autoCoding=res.value;
        if(this.autoCoding!="1")
        {
          this.addEditForm.get('code').setValidators([Validators.required,Validators.maxLength(100)]);
          this.addEditForm.get('code').updateValueAndValidity();        }
      }, error => {
        this.alertInput = new AlertInput("f", "error.error500");
      });
  }
  numberOnly(e): boolean {
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
      }
}
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PermissionService } from '../../shared/services/permission.service';
import { BaseObject } from '../../../../../../accounting/suppliers/shared/data/base-object.model';
import { AlertifyService } from '../../../../../../../infrastructure/services/alertify.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BreadCrumbItem } from '../../../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { AlertInput } from '../../../../../../../shared/alerts/alert-input';
import { FullRoutes } from '../../../../../../../infrastructure/data/enums/angular-full-routes.enum';

@Component({
  selector: 'app-add-output-permission',
  templateUrl: './add-output-permission.component.html',
  styleUrls: ['./add-output-permission.component.scss']
})
export class AddOutputPermissionComponent implements OnInit {
  breadCrumbItems: BreadCrumbItem[] = [
    { url: '', label: 'stockManagement.permissions.permissions' },
    { url: '', label: 'stockManagement.permissions.outPutPermission' }
  ];
  createForm: FormGroup;
  isLoading:boolean=false;

  constructor(private fb: FormBuilder,private permissionService:PermissionService ,
      private alertifyService: AlertifyService,
    private router: Router,
    protected translate: TranslateService,
    private ngxService: NgxUiLoaderService) { }
  measuringUnits: BaseObject[];
  firstProducts: BaseObject[]= [];
  //SeconedProducts: BaseObject[]= [];
  ;
  productTypeKey: string;
  inventory: BaseObject[];
  alertInput: AlertInput = new AlertInput();

  ngOnInit() {
    this.createAddEditForm();
    this.getStoks();
    //this.getProducts();
  }
  createAddEditForm() {
    
    this.createForm = this.fb.group({
      Date:[new Date(),[Validators.required]],
      BookCode:[],
      DocumentCode:[],
      InventoryId: [null,[Validators.required]],
      Notes: [null],
      inventoryProducts: this.fb.array([]),
      //Key:[null,[Validators.required]]
    });
  }

  createInventoryProducts(): FormGroup {
    return this.fb.group({
      units: [],
      quantity: [1, [Validators.required, Validators.min(1)]],
      purchasingPrice: [1, [Validators.required, Validators.min(1)]],
      total: [1, [Validators.required, Validators.min(1)]],
      productId: [null, [Validators.required]],
      productCode: [null, [Validators.required]],

      UnitId: [null, [Validators.required]]
    });
  }
   //InventoryProducts
   addInventoryProducts() {
    const InventoryProducts = this.createForm.get('inventoryProducts') as FormArray;
    InventoryProducts.push(this.createInventoryProducts());
  }
 
   setCodeControlValue(index){
    var current = (this.createForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].value;
    let product=this.firstProducts.find(x=>x.id==current);
    (this.createForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productCode'].setValue(product.code);

   }
  onInventoryProducts(index) {
    if ((this.createForm.get('inventoryProducts') as FormArray).value.length < 2) {
      this.setCodeControlValue(index);
      return;
    }
    else {
      var current = (this.createForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].value;
      var list = (this.createForm.get('inventoryProducts') as FormArray).value;
      var isUnique = list.filter(x => x.productId === current).length > 1;

      if (isUnique) {
        (this.createForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].setErrors({ notUnique: true });
        (this.createForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].setValue(null);
        (this.createForm.get('inventoryProducts') as FormArray).controls[index].markAsTouched();
       // this.alertifyService.error('systemData.product.uniqueItem');
        this.alertInput = new AlertInput("f", "permissions.repated");
        return;
      }
      else{
        this.setCodeControlValue(index);

      }
    }
    
  }



  
 

  

  getStoks() {
    this.permissionService.getStoks()
      .subscribe((res: BaseObject[]) => {
        this.inventory = res;
        // this.distributors = res;
        // console.log(res)
      }, error => {
        console.log(error);
        //this.alertify.error(error);
      });
  }


  fireValidation(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.fireValidation(control);
      }
    });
  }
  totalChange(inventoryProductsIndex) {
    (this.createForm.get('inventoryProducts') as FormArray).controls[inventoryProductsIndex]['controls']['total'].setValue(
      (this.createForm.get('inventoryProducts') as FormArray).controls[inventoryProductsIndex]['controls']['quantity'].value *
      (this.createForm.get('inventoryProducts') as FormArray).controls[inventoryProductsIndex]['controls']['purchasingPrice'].value
    );
  }
  getMeasuringUnits(index) {
    var current = (this.createForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].value;
    this.permissionService.getMeasuringUnitsById(current)
      .subscribe((res: BaseObject[]) => {
        // this.measuringUnits = res;
       (this.createForm.get('inventoryProducts') as FormArray).controls[index]['controls']['units'].setValue(res);
        // console.log(res)
      }, error => {
        console.log(error);
        //this.alertify.error(error);
      });
  }

  deleteInventoryProducts(index) {
    var current = (this.createForm.get('inventoryProducts') as FormArray).at(index).value;
  
       (this.createForm.get('inventoryProducts') as FormArray).removeAt(index);
    
  }
  add(close:boolean) {
    if (this.createForm.valid) {
      if((this.createForm.get('inventoryProducts') as FormArray).length==0){
     //   this.alertifyService.success('permissions.noProducts');
        this.alertInput = new AlertInput("f", "permissions.noProducts");
           return 0;
      }
      this.ngxService.startBackground();
      this.permissionService.add(this.createForm.value).subscribe(
        res => {
        //this.router.navigate(['/' + FullRoutes.STOCK_MODULE + '/' + FullRoutes.OPENING_BALANCE + '/' + FullRoutes.OPENING_BALANCE_LIST]);
        this.ngxService.stopBackground();
        this.alertInput = new AlertInput("s", "shared.savedsuccess");

       // this.alertifyService.success('shared.savedsuccess'+" "+res.code);
       if(close){ 
        this.cancal();
       }
       else{
        this.createForm.reset();
       }

        // this.distributors = res;
        // console.log(res)
      }, error => {
        console.log(JSON.stringify(error));
        this.ngxService.stopBackground();
        if(error.status==406){
         // this.alertifyService.error('permissions.repatedBookCode');
          this.alertInput = new AlertInput("f", "permissions.repatedBookCode");

        }
        //this.alertify.error(error);
      });

    } else {
      this.fireValidation(this.createForm);
    }
  }


  startAutoCompleteProduct(value:String,searchIn:String) {
 
    /******autoComplete********/

  if(value!=null&&value!=""&&value!=undefined&&value.length!=0){
    this.isLoading=true;

      if(searchIn=='name'){
      this.permissionService.getProductByName(value).subscribe(
        (response: BaseObject[])=>{
               this.firstProducts=response;

               console.log("serach objs :- :- :- "+JSON.stringify(this.firstProducts));
               this.isLoading=false;

        },
        error=>{
          console.log(error);
          this.isLoading=false;

         }
      )
    }
    if(searchIn=='code'){
      this.permissionService.getProductByKey(value).subscribe(
        (response: BaseObject[])=>{
          this.isLoading=false;

               this.firstProducts=response;
               console.log("serach objs :- :- :- "+JSON.stringify(this.firstProducts));
        },
        error=>{
          this.isLoading=false;

          console.log(error);
         }
      )
    }
  }
    else{
      console.log("empty string;")
    }
    /******end of autoComplete********/
  
}
getOptionText(option):string {
  if(option!=null&&(this.firstProducts!=undefined&&this.firstProducts!=null)){
  console.log(JSON.stringify(option));
  let name:string= this.firstProducts.find(x=>x.id==option).name;
  //this.firstProducts=[];
  return name;
  }
}

selectProductByCode(index) {
 
  console.log(JSON.stringify(index));
  var current = (this.createForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productCode'].value;
   let product= this.firstProducts.find(x=>x.code==current);

  //let id:number= this.SeconedProducts.find(x=>x.code==option).id;
  (this.createForm.get('inventoryProducts') as FormArray).controls[index]['controls']['productId'].setValue(product.id);
 this.onInventoryProducts(index);
 this.getMeasuringUnits(index); 
}
clearForm()
  {
    this.createForm.reset();
  }
cancal(){
  this.router.navigate(['/'+FullRoutes.STOCK_MODULE+'/'+FullRoutes.PERMISSION+'/'+FullRoutes.OUTPUT_PERMISSION_LIST]);
}
addNewProduct(){
  window.open("/purchases/systemData/products/add-product", "_blank");
}
}

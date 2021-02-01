import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { purchaseProductList } from '../../../../../../modules/accounting/purchases/component/shared/data/productList.model';
import { AlertInput } from '../../../../../../shared/alerts/alert-input';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseObject } from '../../../../../../modules/accounting/suppliers/shared/data/base-object.model';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../../../../modules/accounting/system-data/products/shared/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from '../../../../../../infrastructure/services/alertify.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { openingBalanceService } from '../../../../../../modules/accounting/stock-management/opening-balance/shared/services/opening-balance.service';
import { SalesInvoiceService } from '../../../shared/services/sales-invoice.service';

@Component({
  selector: 'app-add-sales-invoice',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [ProductService, SalesInvoiceService, openingBalanceService]
})
export class AddSalesInvoiceComponent implements OnInit {

  breadCrumbItems: BreadCrumbItem[] = [
    { url: '', label: 'sales.salesInvoice' },
    { url: '', label: 'sideNav.salesInvoice.add' }
  ];
  productList: purchaseProductList[];
  alertInput: AlertInput = new AlertInput();
  addEditForm: FormGroup;
  measuringUnits: any[];
  autoCoding: any;
  products: any[];
  addProduct: FormGroup;
  inventory: BaseObject[];
  suppliers: BaseObject[];
  addEditModel: any;
  isProductLoading: boolean;
  isEditedProduct: boolean = false;
  allProduct: BaseObject[];
  isLoading: boolean;
  customers: BaseObject[];
  delegates: any;
  isProductCodeLoading: boolean;
  constructor(private http: HttpClient,
    private productService: ProductService,
    private service: SalesInvoiceService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private alertifyService: AlertifyService,
    private router: Router,
    private openingBalanceService: openingBalanceService,
    protected translate: TranslateService,
    private ngxService: NgxUiLoaderService) {
    this.getSystemCoding();
  }

  ngOnInit() {
    this.buildForm();
    this.activatedRoute.params.subscribe(params => {
      if (params["id"] != undefined)
        this.findbyId(params["id"]);
    });
    // this.getMeasuringUnit();
    this.getProducts();
    this.getProductsByCode();
    this.getStoks();
    this.getCustomerAutoCompleteService();
  }
  findbyId(id) {
    this.ngxService.start();
    this.service.findById(id)
      .subscribe((res: any) => {
        this.addEditModel = res;
        this.productList = this.addEditModel.invoiceProducts;
        this.addEditForm.patchValue(this.addEditModel);
        this.ngxService.stop();
      }, error => {
        this.alertInput = new AlertInput("f", "error.error500");
        this.ngxService.stop();
      });
  }

  buildForm() {
    this.addEditForm = this.formBuilder.group({
      invoiceId: [null],
      //code: [null],
      invoiceNotes: [null, Validators.maxLength(200)],
      inventoryId: [null, Validators.required],
      // supplierId: [null, Validators.required],
      invoiceDate: [new Date(), Validators.required],
      invoiceTotalValue: [0],
      invoicePaymentType: [null, Validators.required],
      invoiceNetValue: [0],
      invoiceVat: [0],
      invoiceRestValue: [0],
      ledgerNumber: [null],
      discountValue: [0],
      discountPercentage: [0, [Validators.max(100), Validators.min(0)]],
      additionalCosts: [0],
      invoicePaidValue: [0],
      customerId: [null],
      clientContactPersonId: [0],

      invoiceProducts: [],
      product: this.formBuilder.group({
        id: [],
        productCode: [null, [Validators.required]],
        productId: [null, [Validators.required]],
        productUnitId: [null, [Validators.required]],
        productAmount: [1, [Validators.required, Validators.min(1)]],
        productPrice: [1, [Validators.required, Validators.min(1)]],
        productDiscount: [0, [Validators.required, Validators.min(0)]],
        productTotalValue: [1, [Validators.required, Validators.min(1)]],
        productVat: [0],
      })
    });
  }
  cancal() {
    this.router.navigate(['/sales/sales-invoice/list']);
  }
  clearForm() {
    this.buildForm();
    this.getCustomerAutoCompleteService();
    this.productList = [];
    this.addEditForm.get('inventoryId').setValue(this.inventory[0].id);
  }
  AddEditRest() {
    (<any>Object).values((this.addEditForm.get('product') as FormGroup).controls).forEach(control => {
      control.setValidators(null);
      control.updateValueAndValidity();
    });
    if (this.addEditForm.valid) {
      if (this.productList && this.productList.length > 0) {
        this.ngxService.startBackground();
        var pList = this.productList;
        pList.forEach((product, x) => {
          product.product = null;
          product.unit = null;
        });
        (this.addEditForm.get('invoiceProducts').setValue(pList));
        // (this.addEditForm.get('invoiceProducts').setValue(this.productList));
        this.service.addEdit(this.addEditForm.value).subscribe(res => {
          this.clearForm();
          this.productList = [];
          this.ngxService.stopBackground();
        }, error => {
          console.log(error);
          this.ngxService.stopBackground();
        });
      } else {
        this.alertifyService.error('purchasing.rebate.productReq');
      }
    } else {
      this.fireValidation(this.addEditForm);
    }
  }
  addEdit() {
    (<any>Object).values((this.addEditForm.get('product') as FormGroup).controls).forEach(control => {
      control.setValidators(null);
      control.updateValueAndValidity();
    });
    if (this.addEditForm.valid) {
      if (this.productList && this.productList.length > 0) {
        this.ngxService.startBackground();
        // (this.addEditForm.get('invoiceProducts').setValue(this.productList));
        var pList = this.productList;
        pList.forEach((product, x) => {
          product.product = null;
          product.unit = null;
        });
        (this.addEditForm.get('invoiceProducts').setValue(pList));
        this.service.addEdit(this.addEditForm.value).subscribe(res => {
          this.router.navigate(['/sales/sales-invoice/list']);
          this.ngxService.stopBackground();
        }, error => {
          console.log(error);
          this.ngxService.stopBackground();
        });
      } else {
        this.alertifyService.error('purchasing.rebate.productReq');
      }
    } else {
      this.fireValidation(this.addEditForm);
    }
  }

  fireValidation(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.fireValidation(control);
      }
    });
  }

  deleteProducts(index) {
    var current = this.productList[index];
    if (current.id > 0) {
      current.isDeleted = true;
      // this.service.deletPurchaseProductById(current.id).subscribe(res => {
      //   //TODO: Use Success Alert
      //   this.translate.get('shared.deletedSuccess').subscribe(res => {
      //     this.alertifyService.success(res);
      //   });
      //   this.productList.splice(index, 1);
      // }, error => {
      //   //TODO: Use Failure Alert
      // });
    } else {
      this.productList.splice(index, 1);
    }
  }

  editProduct(index) {
    this.productList.forEach(item => {
      item.isEdited = false;
    })
    var current = this.productList[index];
    this.products = [];
    this.measuringUnits = [];
    this.products.push(current.product);
    this.measuringUnits.push(current.unit);
    current.isEdited = true;
    this.isEditedProduct = true;
    (this.addEditForm.get('product') as FormGroup).controls['id'].setValue(current.id);
    (this.addEditForm.get('product') as FormGroup).controls['productCode'].setValue(current.productCode);
    (this.addEditForm.get('product') as FormGroup).controls['productId'].setValue(current.productId);
    (this.addEditForm.get('product') as FormGroup).controls['productUnitId'].setValue(current.productUnitId);
    (this.addEditForm.get('product') as FormGroup).controls['productAmount'].setValue(current.productAmount);
    (this.addEditForm.get('product') as FormGroup).controls['productPrice'].setValue(current.productPrice);
    (this.addEditForm.get('product') as FormGroup).controls['productDiscount'].setValue(current.productDiscount);
    (this.addEditForm.get('product') as FormGroup).controls['productTotalValue'].setValue(current.productTotalValue);
    (this.addEditForm.get('product') as FormGroup).controls['productVat'].setValue(current.productVat);

  }
  cancalEdit(){
    this.productList.forEach(item => {
      item.isEdited = false;
    })
    this.isEditedProduct = false;
    this.products = [];
    this.measuringUnits = [];
  }
  saveEditProduct(index) {
    if (this.addEditForm.get('product').valid) {
      if (this.allProduct != undefined && this.allProduct != null) {
        var purchaseProduct = this.addEditForm.get('product').value;
        var product = this.allProduct.filter(x => x.id == purchaseProduct.productId)[0];
        var unit = this.measuringUnits.filter(x => x.id == purchaseProduct.productUnitId)[0];
        if (this.productList.filter(x => x.productId == product.id && x.unitId == unit.id && x.isDeleted == false && x.isEdited == false).length < 1) {
          var current = this.productList[index];
          this.isEditedProduct = false;
          current.id = purchaseProduct.id;
          current.productCode = purchaseProduct.productCode;
          current.productAmount = purchaseProduct.productAmount;
          current.productPrice = purchaseProduct.productPrice;
          current.productDiscount = purchaseProduct.productDiscount;
          current.productTotalValue = purchaseProduct.productTotalValue;
          current.productVat = (purchaseProduct.productTotalValue * purchaseProduct.productVat / 100);
          current.product = product;
          current.productUnit = unit;
          current.isDeleted = false;
          current.isEdited = false;
          current.productId = product.id;
          current.unitId = unit.id;
          current.productUnitId = unit.id;
          current.unit = unit;
          this.calcTotalBill();
          this.restProduct();
          this.measuringUnits = [];
        } else {
          this.alertifyService.error('systemData.product.uniqueItem');
        }

      }
    } else {
      (<any>Object).values((this.addEditForm.get('product') as FormGroup).controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
  
  saveProducts() {
    if (this.addEditForm.get('product').valid) {
      if (this.allProduct != undefined && this.allProduct != null) {
        var purchaseProduct = this.addEditForm.get('product').value;
        var product = this.allProduct.filter(x => x.id == purchaseProduct.productId)[0];
        var unit = this.measuringUnits.filter(x => x.id == purchaseProduct.productUnitId)[0];
        if (!this.productList)
          this.productList = [];
        if (this.productList.filter(x => x.productId == product.id && x.unitId == unit.id && x.isDeleted == false).length < 1) {
          this.productList.push({
            id: purchaseProduct.id,
            productCode: purchaseProduct.productCode,
            productAmount: purchaseProduct.productAmount,
            productPrice: purchaseProduct.productPrice,
            productDiscount: purchaseProduct.productDiscount,
            productTotalValue: purchaseProduct.productTotalValue,
            productVat: (purchaseProduct.productTotalValue * purchaseProduct.productVat / 100),
            product: product,
            productUnit: unit,
            isDeleted: false,
            isEdited: false,
            productId: product.id,
            unitId: unit.id,
            productUnitId: unit.id,
            unit: unit
          });
          this.calcTotalBill();
          this.restProduct();
          this.measuringUnits = [];
        } else {
          this.alertifyService.error('systemData.product.uniqueItem');
        }

      }
    } else {
      (<any>Object).values((this.addEditForm.get('product') as FormGroup).controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }



  totalChange() {
    var purchaseProduct = this.addEditForm.get('product').value;
    (this.addEditForm.get('product') as FormGroup).controls['productTotalValue'].setValue(
      ((purchaseProduct.productAmount * purchaseProduct.productPrice) - purchaseProduct.productDiscount));
  }

  calcTotalBill() {
    var totalValue = 0;
    var totalVat = 0;
    this.productList.forEach((product, x) => {
      totalValue += product.productTotalValue;
      totalVat += product.productVat;
    });
    (this.addEditForm.get('invoiceTotalValue').setValue(totalValue));
    (this.addEditForm.get('invoiceVat').setValue(totalVat));
    (this.addEditForm.get('invoiceNetValue').setValue(totalValue + totalVat - this.addEditForm.get('discountValue').value));
  }

  totalNetChange() {
    var invoiceTotalValue = this.addEditForm.get('invoiceTotalValue').value;
    var discountPercentage = this.addEditForm.get('discountPercentage').value;
    var additionalCosts = this.addEditForm.get('additionalCosts').value;
    var invoiceVat = this.addEditForm.get('invoiceVat').value;
    if (discountPercentage > 0) {
      (this.addEditForm.get('discountValue').setValue(invoiceTotalValue * discountPercentage / 100));
    }else{
      this.addEditForm.get('discountPercentage').setValue(0);
      this.addEditForm.get('discountValue').setValue(0);
    }
    (this.addEditForm.get('invoiceNetValue').setValue(invoiceTotalValue + invoiceVat +
       additionalCosts - this.addEditForm.get('discountValue').value));
  }

  restProduct() {
    this.addEditForm.get('product').reset();
    (this.addEditForm.get('product') as FormGroup).controls['productAmount'].setValue(1);
    (this.addEditForm.get('product') as FormGroup).controls['productPrice'].setValue(1);
    (this.addEditForm.get('product') as FormGroup).controls['productVat'].setValue(0);
    (this.addEditForm.get('product') as FormGroup).controls['productDiscount'].setValue(0);
    (this.addEditForm.get('product') as FormGroup).controls['productTotalValue'].setValue(1);
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

  getSystemCoding() {
    this.productService.getSystemParameter('systemCoding')
      .subscribe((res: any) => {
        this.autoCoding = res.value;
        if (this.autoCoding != "1") {
          this.addEditForm.get('code').setValidators([Validators.required, Validators.maxLength(100)]);
          this.addEditForm.get('code').updateValueAndValidity();
        }
      }, error => {
        console.log(error);
        this.alertInput = new AlertInput("f", "error.error500");
        //this.alertify.error(error);
      });
  } 

  unitChange() {
    var unitId = (this.addEditForm.get('product') as FormGroup).controls['productUnitId'].value;
    if (unitId != null)
      (this.addEditForm.get('product') as FormGroup).controls['productPrice'].setValue(this.measuringUnits.find(x => x.id == unitId).price);
    this.totalChange()
  }

  getOptionProductText(option): string {
    if (option != null && (this.products != undefined && this.products != null)) {
      console.log(JSON.stringify(option));
      var product = this.products.find(x => x.id == option);
      this.allProduct = this.products;
      let name: string = product.name;
      this.measuringUnits = [];
      this.measuringUnits = product.productUnits;
      (this.addEditForm.get('product') as FormGroup).controls['productCode'].setValue(product.code);
      (this.addEditForm.get('product') as FormGroup).controls['productVat'].setValue(product.taxAmount);
      return name;
    }
  }

  getOptionProductCodeText() {
    var option=(this.addEditForm.get('product') as FormGroup).controls['productCode'].value;
    if (option != null && (this.products != undefined && this.products != null)) {
      console.log(JSON.stringify(option));
      var product = this.products.find(x => x.code == option);
      this.allProduct = this.products;
      this.measuringUnits = [];
      this.measuringUnits = product.productUnits;
      (this.addEditForm.get('product') as FormGroup).controls['productId'].setValue(product.id);
      (this.addEditForm.get('product') as FormGroup).controls['productVat'].setValue(product.taxAmount);
    }
  }

  getProducts() {
    /******autoComplete********/
    (this.addEditForm.get('product') as FormGroup).controls['productId'].valueChanges
      .subscribe(data => {
        // debugger
        this.isProductLoading = true;
        this.service.getProduct(data).subscribe((res: BaseObject[]) => {
          this.products = res;
          this.isProductLoading = false;

        }, error => {
          this.alertInput = new AlertInput("f", "error.error500");
        });
      });
    /******end of autoComplete********/
  }


  getProductsByCode() {
    /******autoComplete********/
    (this.addEditForm.get('product') as FormGroup).controls['productCode'].valueChanges
      .subscribe(data => {
        // debugger
        this.isProductCodeLoading = true;
        this.service.getProductsByCode(data).subscribe((res: BaseObject[]) => {
          this.products = res;
          this.isProductCodeLoading = false;

        }, error => {
          this.alertInput = new AlertInput("f", "error.error500");
        });
      });    
    /******end of autoComplete********/
  }

  getStoks() {
    this.openingBalanceService.getStoks()
      .subscribe((res: BaseObject[]) => {
        this.inventory = res;
        this.addEditForm.get('inventoryId').setValue(this.inventory[0].id);
      }, error => {
        console.log(error);
      });
  }



  getOptionText(option): string {
    if (option != null && (this.customers != undefined && this.customers != null)) {
      console.log(JSON.stringify(option));
      let name: string = this.customers.find(x => x.id == option).name;
      this.findDelegateById(option)
      this.customers = [];
      return name;
    }
  }

  getCustomerAutoCompleteService() {
    /******autoComplete********/
    this.addEditForm.controls['customerId'].valueChanges
      .subscribe(data => {
        this.isLoading = true;
        this.service.getCustomer(data).subscribe((res: BaseObject[]) => {
          this.customers = res;
          this.isLoading = false;

        }, error => {
          this.alertInput = new AlertInput("f", "error.error500");
        });
      });
    /******end of autoComplete********/
  }

  findDelegateById(id) {
    this.service.findDelegateById(id)
      .subscribe((res: any) => {
        this.delegates = [];
        this.delegates.push(res);
      }, error => {
        this.alertInput = new AlertInput("f", "error.error500");
        this.ngxService.stop();
      });
  }

  addNewCustomer(){
    window.open("/sales/customers/customer", "_blank");
  }
  addNewProduct(){
    window.open("/sales/systemData/products/add-product", "_blank");
  }


}

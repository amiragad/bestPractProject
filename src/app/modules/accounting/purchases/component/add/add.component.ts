import { Component, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../infrastructure/dto/BreadCrumbItem.dto';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../system-data/products/shared/services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from '../../../../../infrastructure/services/alertify.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BaseObject } from '../../../suppliers/shared/data/base-object.model';
import { AlertInput } from '../../../../../shared/alerts/alert-input';
import { PurchaseService } from '../shared/services/purchase.service';
import { purchaseProductList } from '../shared/data/productList.model';
import { openingBalanceService } from '../../../stock-management/opening-balance/shared/services/opening-balance.service';

@Component({
  selector: 'app-add-purchase-invoice',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [ProductService, PurchaseService, openingBalanceService]
})
export class AddPurchaseInvoiceComponent implements OnInit {

  breadCrumbItems: BreadCrumbItem[] = [
    { url: '', label: 'sideNav.purchasing' },
    { url: '', label: 'sideNav.invoice.add' }
  ];
  productList: purchaseProductList[];
  alertInput: AlertInput = new AlertInput();
  addEditForm: FormGroup;
  measuringUnits: BaseObject[];
  autoCoding: any;
  products: any[];
  addProduct: FormGroup;
  inventory: BaseObject[];
  suppliers: BaseObject[];
  addEditModel: any;
  isLoading: boolean;
  autoCompleteResults: BaseObject[];
  isProductLoading: boolean;
  isEditedProduct: boolean = false;
  allProduct: any[];
  isProductCodeLoading: boolean;
  productsCode: any[];
  constructor(private http: HttpClient,
    private productService: ProductService,
    private service: PurchaseService,
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
    this.getSupplierAutoCompleteService();

  }
  findbyId(id) {
    this.ngxService.start();
    this.service.findById(id)
      .subscribe((res: any) => {
        // debugger;
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
      supplierId: [null, Validators.required],
      invoiceDate: [new Date(), Validators.required],
      invoiceTotalValue: [0],
      invoicePaymentType: [null, Validators.required],
      invoiceNetValue: [0],
      invoiceVat: [0],
      invoiceRestValue: [0],
      ledgerNumber: [null],
      discountValue: [0],
      discountPercentage: [0],
      additionalCosts: [0],
      invoicePaidValue: [0],

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
    this.router.navigate(['/purchases/list']);
  }
  clearForm() {
    this.buildForm();
    this.getSupplierAutoCompleteService();
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
        // (this.addEditForm.get('invoiceProducts').setValue(this.productList));
        var pList = this.productList;
        pList.forEach((product, x) => {
          product.product = null;
          product.unit = null;
        });
        (this.addEditForm.get('invoiceProducts').setValue(pList));
        this.service.addEdit(this.addEditForm.value).subscribe(res => {
          this.buildForm();
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
        var pList = this.productList;
        pList.forEach((product, x) => {
          product.product = null;
          product.unit = null;
        });
        (this.addEditForm.get('invoiceProducts').setValue(pList));
        this.service.addEdit(this.addEditForm.value).subscribe(res => {
          this.router.navigate(['/purchases/list']);
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
    } else {
      this.addEditForm.get('discountPercentage').setValue(0);
      this.addEditForm.get('discountValue').setValue(0);
    }
    (this.addEditForm.get('invoiceNetValue').setValue(invoiceTotalValue + invoiceVat + additionalCosts - this.addEditForm.get('discountValue').value));
  }

  restProduct() {
    this.addEditForm.get('product').reset();
    (this.addEditForm.get('product') as FormGroup).controls['productAmount'].setValue(1);
    (this.addEditForm.get('product') as FormGroup).controls['productPrice'].setValue(1);
    (this.addEditForm.get('product') as FormGroup).controls['productVat'].setValue(0);
    (this.addEditForm.get('product') as FormGroup).controls['productDiscount'].setValue(0);
    (this.addEditForm.get('product') as FormGroup).controls['productTotalValue'].setValue(1);
    this.isEditedProduct = false;
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
  getOptionText(option): string {
    if (option != null && (this.autoCompleteResults != undefined && this.autoCompleteResults != null)) {
      console.log(JSON.stringify(option));
      let name: string = this.autoCompleteResults.find(x => x.id == option).name;
      this.autoCompleteResults = [];
      return name;
    }
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
    var option = (this.addEditForm.get('product') as FormGroup).controls['productCode'].value;
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

  // getMeasuringUnits() {
  //   var purchaseProduct = this.addEditForm.get('product').value;
  //   this.openingBalanceService.getMeasuringUnitsById(purchaseProduct.productId)
  //     .subscribe((res: BaseObject[]) => {
  //       this.measuringUnits = res;
  //       // console.log(res)
  //     }, error => {
  //       console.log(error);
  //       //this.alertify.error(error);
  //     });
  // }

  getSupplierAutoCompleteService() {
    /******autoComplete********/
    this.addEditForm.controls['supplierId'].valueChanges
      .subscribe(data => {
        // debugger
        this.isLoading = true;
        this.service.getSupplier(data).subscribe((res: BaseObject[]) => {
          this.autoCompleteResults = res;
          this.isLoading = false;

        }, error => {
          this.alertInput = new AlertInput("f", "error.error500");
        });
      });
    /******end of autoComplete********/
  }

  addNewSuppler() {
    window.open("/purchases/suppliers/addSupplier", "_blank");
  }
  addNewProduct() {
    window.open("/purchases/systemData/products/add-product", "_blank");
  }
}

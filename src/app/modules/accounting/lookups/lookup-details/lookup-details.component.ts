import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LookupService } from '../shared/services/lookup-service.service';
import { LookupDetails } from '../shared/data/lookup-details';
import { BreadCrumbItem } from '../../../../infrastructure/dto/BreadCrumbItem.dto';
import { ResultSet } from '../../../../infrastructure/data/ResultSet';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrderInfo } from '../../../../infrastructure/interfaces/list/data/order-info.model';
import { ActivatedRoute } from '@angular/router';
import { LightLookupDetailsParent } from '../shared/data/light-lookup-details-parent';
import { LookupAddEdit } from '../shared/data/lookupAddEdit';
import { AlertifyService } from '../../../../infrastructure/services/alertify.service';
import { AlertInput } from '../../../../shared/alerts/alert-input';

@Component({
  selector: 'app-lookup-details',
  templateUrl: './lookup-details.component.html',
  styleUrls: ['./lookup-details.component.scss']
})
export class LookupDetailsComponent implements OnInit {

  constructor(private lookupService: LookupService, private ngxService: NgxUiLoaderService,private alertifyService:AlertifyService
  , private activatedRoute :ActivatedRoute, private fb: FormBuilder) {
   
   }
  masterId:number;
  parentId:number;
  masterKey:string;
  isParent:boolean;
  showParentControl:boolean=false;
  resultSet: ResultSet<LookupDetails> = new ResultSet<LookupDetails>();
  lookupParentList:Array<LightLookupDetailsParent>=[];
  breadCrumbItems: BreadCrumbItem[] = [
    { url: '', label: 'sideNav.basicData' },
    { url: '', label: 'sideNav.lookup' }
  ];

  searchForm: FormGroup;
  createForm: FormGroup;
  id: number;

  orderInfo: OrderInfo = new OrderInfo('id', 'desc');
  @ViewChild('cancelAddEditModal') closeAddEditModel : ElementRef ;
  @ViewChild('openAddEditModel') openAddEditModel : ElementRef ;
  @ViewChild('closeDeleteModal') closeDeleteModal : ElementRef ;
  alertInput: AlertInput = new AlertInput();
  lookupName:string;

  ngOnInit() {
    this.createSearchForm();
    this.createAddEditForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchForm.get('masterId').setValue(params['masterId']);
      this.getByName(params['masterId']);
    
      // this.createForm.get("masterId").setValue(params['masterId']);
      this.masterKey=params['masterKey'];
      this.masterId=params['masterId'];

      this.findAll();
      if(this.masterKey!=null&&this.masterKey!=undefined&&this.masterKey!=''){
           this.getParents(this.masterKey);
           this.showParentControl=true;
      }
  });
  
  }
  getByName(arg0: any) {
    debugger
  let sss=  this.lookupService.findByName(arg0).subscribe(res => {
      debugger
      console.log( JSON.parse(JSON.stringify(res)));
      console.log(JSON.stringify(res));
      this.lookupName = res.name;
    }, error => {
      debugger
    });
  }


  createSearchForm() {
    
    this.searchForm = this.fb.group({
      name: [],
      parentId: [],
      masterId: []
    });
  }

  updateform(){
    debugger
   let dd= this.createForm.get('nameRepeate').value;
  }
  createAddEditForm() {
    
    this.createForm = this.fb.group({
      Id:[0],
      NameAr: [null,[Validators.required]],
      NameEn: [null],
      ParentId: [null],
      masterId:[null,[Validators.required]],
      nameRepeate: [null]
      //Key:[null,[Validators.required]]
    });
  }

  findAll() {
    this.ngxService.start();

     let  serachFields={
         "name":this.searchForm.get("name").value,
         "parentId":this.searchForm.get("parentId").value,
         "masterId":this.searchForm.get("masterId").value,

       };
    this.lookupService.findAllDetails(this.resultSet.pagination, this.orderInfo, serachFields)
      .subscribe(res => {
        this.resultSet = res;
        this.ngxService.stop();


      }, error => {
        this.ngxService.stop();
        this.alertInput = new AlertInput("f", "error.error500");
      });
  }
  pageChanged(page) {
    this.resultSet.pagination.pageNumber = page;
      this.findAll();
      
 }
  sortAsc(column: string) {
    this.orderInfo = { orderBy: column, orderDir: 'ASC' };
    this.findAll();
  }
  sortDesc(column: string) {
    this.orderInfo = { orderBy: column, orderDir: 'DESC' };
    this.findAll();
  }

  fireValidation(formGroup: FormGroup){
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.fireValidation(control);
      }
    });
  }
  getParents(key:string){
    this.createForm.get("ParentId").setValidators([Validators.required]);
    this.createForm.updateValueAndValidity();
    this.lookupService.getParents(key).subscribe(
      success=>{
        this.lookupParentList=success;
      },
      error=>{
        this.alertInput = new AlertInput("f", "error.error500");
      }
    )
  }
  save()
  {
    this.ngxService.start();
    this.createForm.get("masterId").setValue(this.masterId)

    if(this.createForm.valid)
    {
  this.lookupService.save(this.createForm.value).subscribe(
    suucess=>{
      this.ngxService.stop();

      this.createForm.reset();
      this.createForm.get("Id").setValue(null);
      this.clearModal();
      this.closeAddEditModel.nativeElement.click();

      this.findAll();
      this.alertInput = new AlertInput("s", "shared.savedsuccess");

    },
    error=>{
  this.ngxService.stop();

      this.alertInput = new AlertInput("f", "error.error500");
      
    }

  );
    }
    else{
      this.fireValidation(this.createForm);
      this.ngxService.stop();
    }
  }

  getForEdit(id:number){
   let lookupAddEdit:LookupAddEdit=null;
   this.ngxService.startBackground();
   this.lookupService.getForEdit(id).subscribe(
    success=>{
       this.createForm.get("Id").setValue(success.id);
       this.createForm.get("NameAr").setValue(success.nameAr);
       this.createForm.get("NameEn").setValue(success.nameEn);
       this.createForm.get("ParentId").setValue(success.parentId);
       this.createForm.get("nameRepeate").setValue(success.nameRepeate);
       this.createForm.updateValueAndValidity();
       this.openAddEditModel.nativeElement.click();
       this.ngxService.stopBackground();
  },
  error=>{
    this.ngxService.stopBackground();

    this.alertInput = new AlertInput("f", "error.error500");
    
  }
   ) 
  }
  delete(id:number){
    this.lookupService.delete(id).subscribe(
      success=>{
        this.findAll();
        this.closeDeleteModal.nativeElement.click();
        this.alertInput = new AlertInput("s", "shared.deletedSuccess");

      },
      error=>{
        this.alertInput = new AlertInput("f", "error.error500");
      }
    )
  }

  clearModal()
  {
    this.createForm.get("Id").setValue(0);
   this.createForm.get("NameAr").setValue(null);
    this.createForm.get("NameEn").setValue(null);
    this.createForm.get("ParentId").setValue(null);
  }

  clearSearch(){
    this.searchForm.get("name").setValue(null);
    this.findAll();
  }
  stopActivate()
  {
  
    this.resultSet.data.find(x=>x.id==this.id).active= !this.resultSet.data.find(x=>x.id==this.id).active;
  }
  activate()
  {
    this.lookupService.activatedetails(this.id).subscribe(() => {
     
   
       this.findAll();
       this.alertInput = new AlertInput("s", "shared.savedsuccess");
     }, error => {
      this.alertInput = new AlertInput("f", "error.error500");
  
      // this.alertify.error(error);
     });
  }
  
}

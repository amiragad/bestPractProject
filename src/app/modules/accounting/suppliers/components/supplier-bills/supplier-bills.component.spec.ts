import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBillsComponent } from './supplier-bills.component';

describe('SupplierBillsComponent', () => {
  let component: SupplierBillsComponent;
  let fixture: ComponentFixture<SupplierBillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierBillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

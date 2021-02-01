import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOutputPermissionComponent } from './add-output-permission.component';

describe('AddOutputPermissionComponent', () => {
  let component: AddOutputPermissionComponent;
  let fixture: ComponentFixture<AddOutputPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOutputPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOutputPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

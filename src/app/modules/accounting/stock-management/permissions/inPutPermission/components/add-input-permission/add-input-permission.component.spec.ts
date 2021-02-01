import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInputPermissionComponent } from './add-input-permission.component';

describe('AddInputPermissionComponent', () => {
  let component: AddInputPermissionComponent;
  let fixture: ComponentFixture<AddInputPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInputPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInputPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

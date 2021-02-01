import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInputPermissionListComponent } from './add-input-permission-list.component';

describe('AddInputPermissionListComponent', () => {
  let component: AddInputPermissionListComponent;
  let fixture: ComponentFixture<AddInputPermissionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInputPermissionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInputPermissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

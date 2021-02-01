import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPermissionListComponent } from './add-permission-list.component';

describe('AddPermissionListComponent', () => {
  let component: AddPermissionListComponent;
  let fixture: ComponentFixture<AddPermissionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPermissionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPermissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

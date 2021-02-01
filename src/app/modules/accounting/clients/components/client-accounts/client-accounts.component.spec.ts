import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { clientAccountsComponent } from './client-accounts.component';

describe('clientAccountsComponent', () => {
  let component: clientAccountsComponent;
  let fixture: ComponentFixture<clientAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ clientAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(clientAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

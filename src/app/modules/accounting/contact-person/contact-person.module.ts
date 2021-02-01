import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ContactPersonRoutingModule } from './contact-person-routing';
import { AddContactPersonComponent } from './components/add-contact-person/add-contact-person.component';
import { ContactPersonListComponent } from './components/contact-person-list/contact-person-list.component';
import { ContactPersonComponent } from './components/contact-person.component';

@NgModule({
  imports: [
    SharedModule,
    ContactPersonRoutingModule
  ],
  declarations: [ContactPersonComponent, AddContactPersonComponent, ContactPersonListComponent]
})
export class ContactPersonModule { }

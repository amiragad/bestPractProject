
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PurchaseInvoiceComponent } from '../purchases/component/purchase-invoice.component';
import { PurchaseInvoiceListComponent } from '../purchases/component/list/list.component';
import { AddPurchaseInvoiceComponent } from '../purchases/component/add/add.component';
import { FullRoutes } from '../../../infrastructure/data/enums/angular-full-routes.enum';
import { ContactPersonComponent } from './components/contact-person.component';
import { ContactPersonListComponent } from './components/contact-person-list/contact-person-list.component';
import { AddContactPersonComponent } from './components/add-contact-person/add-contact-person.component';

const ContactPersonRoutes: Routes = [
  {
     path: '' ,component
     :ContactPersonComponent,
      children: [
        { path:FullRoutes.CONTACT_PERSON_LIST, component: ContactPersonListComponent },
        { path:FullRoutes.ADD_CONTACT_PERSON , component: AddContactPersonComponent },
        { path: FullRoutes.ADD_CONTACT_PERSON +'/:id', component: AddContactPersonComponent }
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(ContactPersonRoutes)],
  exports: [RouterModule]
})
export class ContactPersonRoutingModule {
}

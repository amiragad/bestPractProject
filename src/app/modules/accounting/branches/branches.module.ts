import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { BranchesRoutingModule } from './branches-routing';
import { BranchListComponent } from './componentes/branch-list/branch-list.component';
import { AddBranchComponent } from './componentes/add-branch/add-branch.component';
import { BranchesComponent } from './componentes/branches.component';


@NgModule({
  imports: [
    SharedModule,
    BranchesRoutingModule
  ],
  declarations: [BranchListComponent, AddBranchComponent, BranchesComponent]
})
export class BranchesModule { }

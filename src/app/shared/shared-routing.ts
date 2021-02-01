
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const sharedRoutes: Routes = [
  {
     path: '' , children:[
      
        
      ]}
  

];

@NgModule({
  imports: [RouterModule.forChild(sharedRoutes)],
  exports: [RouterModule]
})
export class SharedRoutingModule {
}

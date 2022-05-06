import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreasuryComponent } from './treasury.component';

const routes: Routes = [
  {
    path: '',
    component: TreasuryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuryComponentRoutingModule {}

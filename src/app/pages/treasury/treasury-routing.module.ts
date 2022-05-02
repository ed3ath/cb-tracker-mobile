import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreasuryPage } from './treasury.page';

const routes: Routes = [
  {
    path: '',
    component: TreasuryPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuryPageRoutingModule {}

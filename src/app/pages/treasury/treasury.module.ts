import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreasuryPage } from './treasury.page';

import { TreasuryPageRoutingModule } from './treasury-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TreasuryPageRoutingModule
  ],
  declarations: [TreasuryPage]
})
export class TreasuryPageModule {}

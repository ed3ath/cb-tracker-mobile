import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreasuryComponent } from './treasury.component';

import { TreasuryComponentRoutingModule } from './treasury-routing.module';
import { ComponentModule } from '../component.module';



@NgModule({
  declarations: [TreasuryComponent],
  imports: [
    CommonModule,
    ComponentModule,
    TreasuryComponentRoutingModule
  ],
})
export class TreasuryModule { }

import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalculatorPage } from './calculator.page';

import { CalculatorPageRoutingModule } from './calculator-routing.module';
import { ComponentModule } from '../component.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentModule,
    CalculatorPageRoutingModule
  ],
  declarations: [CalculatorPage]
})
export class CalculatorPageModule {}

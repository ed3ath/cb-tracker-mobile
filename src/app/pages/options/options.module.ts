import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OptionsPage } from './options.page';

import { OptionsPageRoutingModule } from './options-routing.module';
import { ComponentModule } from '../component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentModule,
    OptionsPageRoutingModule
  ],
  declarations: [OptionsPage]
})
export class OptionsPageModule {}

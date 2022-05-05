import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats.component';

import { StatsComponentRoutingModule } from './stats-routing.module';
import { ComponentModule } from '../component.module';



@NgModule({
  declarations: [StatsComponent],
  imports: [
    CommonModule,
    ComponentModule,
    StatsComponentRoutingModule
  ],
})
export class StatsModule { }

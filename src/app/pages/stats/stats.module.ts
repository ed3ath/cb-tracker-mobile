import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from './stats.component';

import { StatsComponentRoutingModule } from './stats-routing.module';



@NgModule({
  declarations: [StatsComponent],
  imports: [
    CommonModule,
    StatsComponentRoutingModule
  ],
})
export class StatsModule { }

import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AccountPage } from './account.page';
import { AccountPageRoutingModule } from './account-routing.module';
import { AddModalComponent } from 'src/app/modals/account/add.modal';
import { ComponentModule } from '../component.module';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentModule,
    AccountPageRoutingModule
  ],
  declarations: [AccountPage, AddModalComponent],
  entryComponents: [AddModalComponent]
})
export class AccountPageModule {}

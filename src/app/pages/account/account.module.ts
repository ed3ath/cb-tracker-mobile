import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountPage } from './account.page';

import { AccountPageRoutingModule } from './account-routing.module';
import { ModalComponent } from 'src/app/modal/modal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AccountPageRoutingModule
  ],
  declarations: [AccountPage, ModalComponent],
  entryComponents: [ModalComponent]
})
export class AccountPageModule {}

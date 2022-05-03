import { ModalComponent } from '../../modal/modal.component';
import { Component, ViewChild } from '@angular/core';
import { IonAccordionGroup, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss']
})
export class AccountPage {
  @ViewChild(IonAccordionGroup)accordionGroup: IonAccordionGroup;
  constructor(private modalCtrl: ModalController) {}
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public mainLogo = '../../assets/cbt-logo.svg';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public burgerMenu = '../../assets/burger-menu.svg';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public headerBg = '../../assets/dungeon.jpg';

  closeAccordion(){
    this.accordionGroup.value = '';
  }

  async openModalAddAccount(){
    const  modal = await this.modalCtrl.create({
      component: ModalComponent
    });

    await modal.present();
  }
}

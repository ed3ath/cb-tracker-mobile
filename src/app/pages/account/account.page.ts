import { AddModalComponent } from '../../modals/account/add.modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { ContractService } from 'src/app/services/contracts.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
})
export class AccountPage implements OnInit {
  @ViewChild(IonAccordionGroup) accordionGroup: IonAccordionGroup;

  public mainLogo = '../../assets/cbt-logo.svg';
  public burgerMenu = '../../assets/burger-menu.svg';
  public headerBg = '../../assets/dungeon.jpg';

  _chain: string;
  _skillPrice: any;
  _gasPrice: any;
  _skillAssets: any;
  _gasBalances: any;
  _multiplier: number;
  _accounts: any;
  _names: any;
  _characters: any;
  _isDestroyed: boolean;

  constructor(
    private modalCtrl: ModalController,
    private _storage: Storage,
    private _contracts: ContractService,
    private _utils: UtilsService
  ) {}

  async ngOnInit() {
    this._isDestroyed = false;
    this._names = (await this._storage.get('names')) || {};
    this._accounts = (await this._storage.get('accounts')) || [];
    await this.ticker();
  }

  async ionViewDidLeave() {
    this._isDestroyed = true;
  }

  closeAccordion() {
    this.accordionGroup.value = '';
  }

  async openModalAddAccount() {
    const modal = await this.modalCtrl.create({
      component: AddModalComponent,
    });

    await modal.present();
  }

  async ticker() {
    const skillPartnerId = await this._contracts.getSkillPartnerId();
    const skillAssets = await this._contracts.getSkillAssets(this._accounts);

    await this._contracts.skillPriceTicker();
    this._names = (await this._storage.get('names')) || {};
    this._accounts = (await this._storage.get('accounts')) || [];

    this._skillPrice = this._utils.currencyFormat(this._contracts._skillPrice);
    this._gasPrice = this._utils.currencyFormat(this._contracts._gasPrice);
    this._gasBalances = await Promise.all(
      this._accounts.map(async (acc) => await this._contracts.getGasBalance(acc))
    );
    this._multiplier = skillPartnerId
      ? Number(await this._contracts.getMultiplier(skillPartnerId))
      : 0;
    this._skillAssets = {
      staked: skillAssets.staked.map((i) => this._utils.formatNumber(i)),
      unclaimed: skillAssets.unclaimed.map((i) => this._utils.formatNumber(i)),
      wallet: skillAssets.wallet.map((i) => this._utils.formatNumber(i)),
      claimable: skillAssets.unclaimed.map((i) => this._utils.formatNumber(Number(i) * this._multiplier))
    };
    console.log(this._skillAssets);;
    if (!this._isDestroyed) {
      setTimeout(() => this.ticker(), 5000);
    }
  }
}

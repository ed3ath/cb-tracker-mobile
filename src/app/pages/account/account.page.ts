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

  public headerBg = '../../assets/dungeon.jpg';
  public headerTitle = 'ACCOUNTS';


  _chain: string;
  _skillPrice: any;
  _gasPrice: any;
  _skillAssets: any;
  _gasBalances: any;
  _multiplier: number;
  _accounts: any;
  _names: any;
  _charIds: any;
  _characters: any;
  _gasName: string;
  _isDestroyed: boolean;
  _repRequirements: any;

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
    if (this._chain !== 'AVAX') {
      this._repRequirements = await this._contracts.getReputationLevelRequirements();
    }
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
    if (this._contracts._isInit) {

      this._chain = await this._contracts.getChain();
      this._names = (await this._storage.get('names')) || {};
      this._accounts = (await this._storage.get('accounts')) || [];
      this._gasName = this._utils.getGasName(this._chain);

      const skillPartnerId = await this._contracts.getSkillPartnerId();
      const skillAssets = await this._contracts.getSkillAssets(this._accounts);
      this._charIds = await Promise.all(
        this._accounts.map(
          async (acc) => await this._contracts.getAccountCharacters(acc)
        )
      );

      await this._contracts.skillPriceTicker();
      this._skillPrice = this._contracts._skillPrice;
      this._gasPrice = this._contracts._gasPrice;
      this._gasBalances = await Promise.all(
        this._accounts.map(
          async (acc) => await this._contracts.getGasBalance(acc)
        )
      );

      this._multiplier = skillPartnerId
        ? Number(await this._contracts.getMultiplier(skillPartnerId))
        : 0;
      this._skillAssets = {
        staked: skillAssets.staked,
        unclaimed: skillAssets.unclaimed,
        wallet: skillAssets.wallet,
        claimable: skillAssets.unclaimed.map(
          (i) => Number(i) * this._multiplier
        ),
      };
      this._characters = await Promise.all(this._charIds.map((i) => this._contracts.getCharactersData(i)));
      console.log(this._charIds, this._characters);
    }
    if (!this._isDestroyed) {
      setTimeout(() => this.ticker(), 5000);
    }
  }

  artsGenerator(character) {
    const allImages = [
      'chara-0.png',
      'chara-1.png',
      'chara-2.png',
      'chara-3.png',
    ];
    if (!character) {
      return '';
    }

    return `../../../assets/accounts/characters/${allImages[character % allImages.length]}`;
  }

  getPercentage(num1, num2) {
    return `${Math.floor((Number(num1) / Number(num2)) * 100)}%`;
  }

  getExpLeft(targetExp, currentExp, rewardExp) {
    return Number(targetExp) - (Number(currentExp) + Number(rewardExp));
  }
}

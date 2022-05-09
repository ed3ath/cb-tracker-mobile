import { Component, ViewChild } from '@angular/core';
import {
  IonAccordionGroup,
  ModalController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

import { StorageService } from 'src/app/services/storage.service';
import { ContractService } from 'src/app/services/contracts.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EventsService } from 'src/app/services/event.service';

import { AddModalComponent } from 'src/app/modals/account/add.modal';
import { ImportModalComponent } from 'src/app/modals/account/import.modal';
import { RenameModalComponent } from 'src/app/modals/account/rename.modal';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
})
export class AccountPage {
  @ViewChild(IonAccordionGroup) accordionGroup: IonAccordionGroup;

  public headerBg = '../../assets/dungeon.jpg';
  public headerTitle = 'ACCOUNTS';
  isLoading = false;

  _chain: string;
  _currentCurrency: string;
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
  _repRequirements: any;

  constructor(
    private modalCtrl: ModalController,
    private _storage: StorageService,
    private _contracts: ContractService,
    private _utils: UtilsService,
    private _action: ActionSheetController,
    private _alert: AlertController,
    private _events: EventsService
  ) {
    this._events.subscribe('accountRefresh', async () => {
      await this.ticker();
    });
  }

  async ionViewDidEnter() {
    this._names = (await this._storage.get('names')) || {};
    this._accounts = (await this._storage.get('accounts')) || [];
    this._chain = '';
    this._currentCurrency = 'USD';
    this.isLoading = true;
    await this.ticker();
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

  async openModalImport() {
    const modal = await this.modalCtrl.create({
      component: ImportModalComponent,
    });

    await modal.present();
  }

  async refresh(event) {
    console.log('refreshing');
    await this.ticker();
    event.target.complete();
    this.isLoading = false;
  }

  async ticker() {
    if (this._chain !== 'AVAX') {
      this._repRequirements =
        await this._contracts.getReputationLevelRequirements();
    }
    this._chain = await this._contracts.getChain();
    this._currentCurrency = await this._contracts.getCurrency();
    this._names = (await this._storage.get('names')) || {};
    this._accounts = (await this._storage.get('accounts')) || [];
    this._gasName = this._utils.getGasName(this._chain);

    const skillPartnerId = await this._contracts.getSkillPartnerId(this._chain);
    const skillAssets = await this._contracts.getSkillAssets(this._accounts);
    this._charIds = await Promise.all(
      this._accounts.map(
        async (acc) => await this._contracts.getAccountCharacters(acc)
      )
    );

    await this._contracts.skillPriceTicker(this._chain);
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
      claimable: skillAssets.unclaimed.map((i) => Number(i) * this._multiplier),
    };
    this._characters = await Promise.all(
      this._charIds.map((i) => this._contracts.getCharactersData(i))
    );
    this.isLoading = false;
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

    return `../../../assets/accounts/characters/${
      allImages[character % allImages.length]
    }`;
  }

  getPercentage(num1, num2) {
    return `${Math.floor((Number(num1) / Number(num2)) * 100)}%`;
  }

  getExpLeft(targetExp, currentExp, rewardExp) {
    return Number(targetExp) - (Number(currentExp) + Number(rewardExp));
  }

  async showMenu(address, event) {
    event.stopPropagation();
    const actionSheet = await this._action.create({
      buttons: [
        {
          text: 'Rename',
          cssClass: 'actionSheetIcon',
          handler: async () => {
            const modal = await this.modalCtrl.create({
              component: RenameModalComponent,
              componentProps: {
                address,
                name: this._names[address],
              },
            });
            await modal.present();
          },
        },
        {
          text: 'Combat Simulator',
          cssClass: 'actionSheetIcon',
          handler: () => {
            console.log(address);
          },
        },
        {
          text: 'Fight Logs',
          cssClass: 'actionSheetIcon',
          handler: () => {
            console.log(address);
          },
        },
        {
          text: 'Delete',
          cssClass: 'actionSheetIcon',
          handler: async () => {
            const name = this._names[address];
            const alert = await this._alert.create({
              header: 'Delete Account Confirmation',
              message: `Are you sure you want to delete ${name}?`,
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                },
                {
                  text: 'Yes',
                  handler: async () => {
                    this._accounts.splice(this._accounts.indexOf(address), 1);
                    delete this._names[address];
                    await this._storage.set('accounts', this._accounts);
                    await this._storage.set('names', this._names);
                    this._utils.displayToaster(`${name} has been removed.`);
                    await this.ticker();
                  },
                },
              ],
            });

            await alert.present();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'actionSheetIcon',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async getDataToFile(fileName) {
    const a = {
      accounts: await this._storage.get('accounts') || [],
      names: await this._storage.get('names') || [],
      currency: await this._storage.get('currency') || 'usd',
      network: await this._storage.get('network') || 'BNB',
    };
    const textToSave = JSON.stringify(a);
    const permission = await Filesystem.checkPermissions();
    if (permission.publicStorage !== 'granted') {
      await Filesystem.requestPermissions();
    }
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: textToSave,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    console.log(savedFile);
    this._utils.displayToaster(`Data saved to ${savedFile.uri}.`);
  }

  async exportData() {
    await this.getDataToFile(`CBTracker-${new Date().getTime()}.json`);
  }
}

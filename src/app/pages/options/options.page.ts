import { Component } from '@angular/core';

import { ContractService } from 'src/app/services/contracts.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EventsService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-options',
  templateUrl: 'options.page.html',
  styleUrls: ['options.page.scss'],
})
export class OptionsPage {
  _currencies: any;
  _currentCurrency: string;
  _chain: string;
  _inLocalCurrency: boolean;
  _notifications: boolean;

  public headerBg = '../../assets/dungeon.jpg';
  public headerTitle = 'OPTIONS';

  constructor(
    private _contracts: ContractService,
    private _utils: UtilsService,
    private _events: EventsService,
    private _storage: StorageService
  ) {
    this._currencies = [
      'php',
      'aed',
      'ars',
      'aud',
      'brl',
      'cny',
      'eur',
      'gbp',
      'hkd',
      'idr',
      'inr',
      'jpy',
      'myr',
      'sgd',
      'thb',
      'twd',
      'usd',
      'vnd',
    ];
  }
  async ionViewDidEnter() {
    this._chain = await this._contracts.getChain();
    this._currentCurrency = await this._contracts.getCurrency();
    this._inLocalCurrency = await this._storage.get('localCurrency');
    this._notifications = await this._storage.get('notifications');
  }

  async saveOptions() {
    await this._contracts.setChain(this._chain);
    await this._contracts.setCurrency(this._currentCurrency);
    await this._storage.set('localCurrency', this._inLocalCurrency);
    await this._storage.set('notifications', this._notifications);
    this._utils.displayToaster('Your changes has been saved.');
    this._events.publish('dashboardRefresh', {
      chain: this._chain,
      currency: this._currentCurrency,
    });
  }
}

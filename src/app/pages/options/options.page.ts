import { Component } from '@angular/core';

import { ContractService } from 'src/app/services/contracts.service';
import { UtilsService } from 'src/app/services/utils.service';
import { EventsService } from 'src/app/services/event.service';

@Component({
  selector: 'app-options',
  templateUrl: 'options.page.html',
  styleUrls: ['options.page.scss'],
})
export class OptionsPage {
  _currencies: any;
  _currentCurrency: string;
  _chain: string;
  _notifications: boolean;

  public headerBg = '../../assets/dungeon.jpg';
  public headerTitle = 'OPTIONS';

  constructor(
    private _contracts: ContractService,
    private _utils: UtilsService,
    private _events: EventsService
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
    this._notifications = true;
  }

  async saveOptions() {
    await this._contracts.setChain(this._chain);
    await this._contracts.setCurrency(this._currentCurrency);
    this._utils.displayToaster('Your changes has been saved.');
    this._events.publish('dashboardRefresh', {chain: this._chain, currency: this._currentCurrency});
  }
}

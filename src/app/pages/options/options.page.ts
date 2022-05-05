import { Component, OnInit } from '@angular/core';

import { ContractService } from 'src/app/services/contracts.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-options',
  templateUrl: 'options.page.html',
  styleUrls: ['options.page.scss'],
})
export class OptionsPage implements OnInit {
  _currencies: any;
  _currentCurrency: string;
  _chain: string;

  constructor(
    private _contracts: ContractService,
    private _utils: UtilsService
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
  async ngOnInit() {
    this._chain = await this._contracts.getChain();
    this._currentCurrency = await this._contracts.getCurrency();
  }

  async saveOptions() {
    await this._contracts.setChain(this._chain);
    await this._contracts.setCurrency(this._currentCurrency);
    this._utils.displayToaster('Changes saved.');
  }
}

import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ContractService } from 'src/app/services/contracts.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage {
  _chain: string;
  _skillPrice: any;
  _gasPrice: any;
  constructor(private _storage: Storage, private _contracts: ContractService) {
    this.init();
  }

  async init() {
    await this._contracts.init();
    await this._contracts.skillPriceTicker();
    this._chain = await this._storage.get('currentChain') || 'BSC';
    this._skillPrice = this.usdFormat(this._contracts._skillPrice);
    this._gasPrice = this.usdFormat(this._contracts._gasPrice);
    setInterval(async () => {
      await this._contracts.skillPriceTicker();
      this._skillPrice = this.usdFormat(this._contracts._skillPrice);
      this._gasPrice = this.usdFormat(this._contracts._gasPrice);
    }, 5000);
  }

  usdFormat(value) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

}

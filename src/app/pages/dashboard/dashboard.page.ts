import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ContractService } from 'src/app/services/contracts.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})
export class DashboardPage {
  _chain: string;
  _currentCurrency: string;
  _skillPrice: any;
  _gasPrice: any;
  _skillAssets: any;
  _gasBalances: any;
  _multiplier: number;
  _accounts: number;
  _characters: number;

  public headerBg = '../../assets/dungeon.jpg';
  public headerTitle = 'DASHBOARD';

  constructor(
    private _storage: Storage,
    private _contracts: ContractService,
    private _utils: UtilsService
  ) {
    this._skillPrice = this._utils.currencyFormat(0, this._currentCurrency);
    this._skillAssets = {
      staked: '0.000000',
      unclaimed: '0.000000',
      wallet: '0.000000',
      claimable: '0.000000',
    };
    this._accounts = 0;
    this._characters = 0;
    this._chain = '';
    this._currentCurrency = '';
  }

  async ionViewDidEnter() {
    await this.ticker();
  }

  async ticker() {
    await this._contracts.skillPriceTicker();

    const accounts = await this._storage.get('accounts') || [];
    const skillPartnerId = await this._contracts.getSkillPartnerId();
    const skillAssets = await this._contracts.getSkillAssets(accounts);
    const charIds = await Promise.all(
      accounts.map(
        async (acc) => await this._contracts.getAccountCharacters(acc)
      )
    );

    this._chain = await this._contracts.getChain();
    this._currentCurrency = await this._contracts.getCurrency();
    this._accounts = accounts.length;
    this._characters = this._utils.sumOfArray(charIds.map((i: []) => i.length));
    this._skillPrice = this._utils.currencyFormat(this._contracts._skillPrice, this._currentCurrency);
    this._gasPrice = this._utils.currencyFormat(this._contracts._gasPrice, this._currentCurrency);
    this._gasBalances = await Promise.all(
      accounts.map(async (acc) => await this._contracts.getGasBalance(acc))
    );
    this._multiplier = skillPartnerId
      ? Number(await this._contracts.getMultiplier(skillPartnerId))
      : 0;
    this._skillAssets = {
      staked: this._utils.formatNumber(
        this._utils.sumOfArray(skillAssets.staked)
      ),
      unclaimed: this._utils.formatNumber(
        this._utils.sumOfArray(skillAssets.unclaimed)
      ),
      wallet: this._utils.formatNumber(
        this._utils.sumOfArray(skillAssets.wallet)
      ),
      claimable: this._utils.formatNumber(
        this._utils.sumOfArray(
          skillAssets.unclaimed.map((unc) => Number(unc) * this._multiplier)
        )
      ),
    };
  }
}

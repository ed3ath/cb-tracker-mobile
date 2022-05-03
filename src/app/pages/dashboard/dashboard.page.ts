import { Component, OnInit  } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ContractService } from 'src/app/services/contracts.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  _chain: string;
  _skillPrice: any;
  _gasPrice: any;
  constructor(private _storage: Storage, private _contracts: ContractService) {}

  async ngOnInit() {
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

  private usdFormat(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public mainLogo = '../../assets/cbt-logo.svg';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public burgerMenu = '../../assets/burger-menu.svg';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public headerBg = '../../assets/dungeon.jpg';
}

import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ContractService } from 'src/app/services/contracts.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})
export class DashboardPage {
  chain;
  constructor(private _storage: Storage, private _contracts: ContractService) {
    this.init();
  }

  async init() {
    this.chain = await this._storage.get('currentChain') || 'BSC';
    let i = 1;
    setInterval(() => {
      this.chain = `BSC${i}`;
      i++;
    }, 3000);
  }

}

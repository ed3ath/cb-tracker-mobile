import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { ConfigService } from './services/config.service';
import { ContractService } from './services/contracts.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private _storage: Storage,
    private _config: ConfigService,
    private _contract: ContractService
  ) {}

  async ngOnInit() {
    await this._storage.create();
    await this._config.init();
    await this._contract.init();
  }
}

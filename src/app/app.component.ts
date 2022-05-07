import { Component, OnInit } from '@angular/core';

import { ConfigService } from './services/config.service';
import { ContractService } from './services/contracts.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private _config: ConfigService,
    private _storage: StorageService,
    private _contract: ContractService
  ) {}

  async ngOnInit() {
    await this._config.init();
    await this._storage.init();
    await this._contract.init();
    console.log('Loaded services...');
  }
}

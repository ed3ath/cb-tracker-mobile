import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import config from '../../../app-config.json';
import extra from '../../../extra-config.json';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  _config: any;

  constructor(private _storage: Storage) {}

  async init() {
    const env = 'production';
    let chain = (await this._storage.get('network'));
    if (!chain) {
      chain = 'BNB';
      await this._storage.set('network', chain);
    }
    this._config = {...config.environments[env].chains[chain], ...extra[chain]};
  }

  get(key: string) {
    return this._config[key];
  }
}

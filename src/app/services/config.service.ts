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
    const chain = (await this._storage.get('currentChain')) || 'BSC';
    this._config = {...config.environments[env].chains[chain], ...extra[chain]};
  }

  get(key: string) {
    return this._config[key];
  }
}

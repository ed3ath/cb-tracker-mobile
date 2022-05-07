import { Injectable } from '@angular/core';

import config from '../../../app-config.json';
import extra from '../../../extra-config.json';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  _config: any;

  constructor() {}

  async init() {
    const env = 'production';
    this._config = config.environments[env].chains;
    config.supportedChains.forEach((chain) => {
      this._config[chain] = {...this._config[chain], ...extra[chain]};
    });
  }

  get(chain, key: string) {
    return this._config[chain][key];
  }
}

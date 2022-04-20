import { Injectable } from '@angular/core';
import Web3 from 'web3';

import config from '../../../app-config.json';

//abis
import cryptoBladesAbi from '../../data/abi/CryptoBlades.json';
import erc20Abi from '../../data/abi/IERC20.json';
import multiCallAbi from '../../data/abi/MultiCall.json';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private _web3: any;
  private _contracts = {} as any;

  constructor(private _storage: Storage) {
    this.setUpContracts();
  }

  async setUpContracts() {
    const rpc = (await this.getConfigValue('rpcUrls'))[0];
    // console.log(Web3);
    this._web3 = new Web3(rpc);
    /*const CryptoBlades = new this._web3.eth.Contract(
      cryptoBladesAbi,
      this.getConfigValue('VUE_APP_CRYPTOBLADES_CONTRACT_ADDRESS')
    );
    const SkillToken = new this._web3.eth.Contract(
      erc20Abi,
      this.getConfigValue('VUE_APP_SKILL_TOKEN_CONTRACT_ADDRESS')
    );
    const MultiCall = new this._web3.eth.Contract(
      multiCallAbi,
      this.getConfigValue('VUE_APP_MULTICALL_CONTRACT_ADDRESS')
    );
    this._contracts = {
      CryptoBlades,
      SkillToken,
      MultiCall
    };*/
  }

  async getConfigValue(key: string) {
    const env = 'production';
    const chain = await this._storage.get('currentChain') || 'BSC';
    return config.environments[env].chains[chain][key];
  }

  getContract(key: string) {
    return this._contracts[key];
  }

  async setChain(chain: string) {
    if ((config).supportedChains.includes(chain)) {
      await this._storage.set('currentChain', chain);
      await this.setUpContracts();
    }
  }
}

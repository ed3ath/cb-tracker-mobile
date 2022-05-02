import { Injectable } from '@angular/core';
import { Interface } from '@ethersproject/abi';
import { Storage } from '@ionic/storage-angular';
import Web3 from 'web3';

import { ConfigService } from './config.service';

import config from '../../../app-config.json';

//abis
import cryptoBladesAbi from '../../data/abi/CryptoBlades.json';
import erc20Abi from '../../data/abi/IERC20.json';
import treasuryAbi from '../../data/abi/Treasury.json';
import multiCallAbi from '../../data/abi/MultiCall.json';
import swapPairAbi from '../../data/abi/SwapPair.json';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  _skillPrice: number;
  _gasPrice: number;
  private _web3: any;
  private _contracts: any;
  private _abis: any;

  constructor(private _storage: Storage, private _config: ConfigService) {}

  async init() {
    this._abis = {
      cryptoblades: cryptoBladesAbi,
      skill: erc20Abi,
      treasury: treasuryAbi,
      multicall: multiCallAbi,
    };

    const rpc = this._config.get('rpcUrls');

    this._web3 = new Web3(rpc[0]);

    const cryptoblades = new this._web3.eth.Contract(
      cryptoBladesAbi,
      this._config.get('VUE_APP_CRYPTOBLADES_CONTRACT_ADDRESS')
    );
    const skill = new this._web3.eth.Contract(
      erc20Abi,
      this._config.get('VUE_APP_SKILL_TOKEN_CONTRACT_ADDRESS')
    );
    const treasury = new this._web3.eth.Contract(
      treasuryAbi,
      this._config.get('VUE_APP_TREASURY_CONTRACT_ADDRESS')
    );
    const multicall = new this._web3.eth.Contract(
      multiCallAbi,
      this._config.get('VUE_APP_MULTICALL_CONTRACT_ADDRESS')
    );

    this._contracts = {
      cryptoblades,
      skill,
      treasury,
      multicall,
    };
  }

  setContract(abi: any, address: string) {
    return new this._web3.eth.Contract(abi, address);
  }

  async getChain() {
    return await this._storage.get('currentChain');
  }

  async setChain(chain: string) {
    if (config.supportedChains.includes(chain)) {
      await this._storage.set('currentChain', chain);
    }
  }

  getContract(key: string) {
    return this._contracts[key];
  }

  getAbi(key: string) {
    return this._abis[key];
  }

  getCallData(abi, address, name, params) {
    return {
      abi,
      calls: params.map((param) => ({
        address,
        name,
        params: param,
      })),
    };
  }

  async multicall({ abi, calls }) {
    const itf = new Interface(abi);

    const calldata = calls.map((call) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);
    const { returnData } = await this._contracts.multicall.methods
      .aggregate(calldata)
      .call();
    const res = returnData.map((call, i) =>
      itf.decodeFunctionResult(calls[i].name, call)
    );
    return res;
  }

  async getSkillPrice() {
    const chain = await this.getChain();
    const contract = this.setContract(swapPairAbi, this._config.get('SKILL_PAIR_CONTRACT_ADDRESS'));
    const reserves = await contract.methods
      .getReserves()
      .call();
    if (chain === 'OEC' || chain === 'POLYGON') {
      return reserves[0] / reserves[1];
    }
    return reserves[1] / reserves[0];
  }

  async getGasPrice() {
    const chain = await this.getChain();
    const contract = this.setContract(swapPairAbi, this._config.get('TOKEN_PAIR_CONTRACT_ADDRESS'));
    const reserves = await contract.methods
      .getReserves()
      .call();
    if (chain === 'OEC') {
      return reserves[0] / reserves[1];
    }
    return reserves[1] / reserves[0];
  }

  async skillPriceTicker() {
    const chain = await this.getChain();
    let skillPrice = await this.getSkillPrice();
    let gasPrice = await this.getGasPrice();

    if (chain === 'POLYGON') {
      gasPrice *= 1000000000000;
      skillPrice *= gasPrice;
    }
    if (chain === 'AVAX') {
      gasPrice *= 1000000000000;
      skillPrice *= 1000000000000;
    }
    this._skillPrice = skillPrice * gasPrice;
    this._gasPrice = gasPrice;
  }
}

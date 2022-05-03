import { Injectable } from '@angular/core';
import { Interface } from '@ethersproject/abi';
import { Storage } from '@ionic/storage-angular';
import Web3 from 'web3';

import { ConfigService } from './config.service';
import { UtilsService } from './utils.service';

import config from '../../../app-config.json';

//abis
import cryptoBladesAbi from '../../data/abi/CryptoBlades.json';
import charactersAbi from '../../data/abi/Characters.json';
import weaponsAbi from '../../data/abi/Weapons.json';
import questAbi from '../../data/abi/SimpleQuests.json';
import erc20Abi from '../../data/abi/IERC20.json';
import treasuryAbi from '../../data/abi/Treasury.json';
import multiCallAbi from '../../data/abi/MultiCall.json';
import swapPairAbi from '../../data/abi/SwapPair.json';
import stakingAbi from '../../data/abi/IStakingRewards.json';
import skillStaking30Abi from '../../data/abi/SkillStakingRewardsUpgradeable.json';
import skillStaking90Abi from '../../data/abi/SkillStakingRewardsUpgradeable90.json';
import skillStaking180Abi from '../../data/abi/SkillStakingRewardsUpgradeable180.json';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  isInit: boolean;
  _skillPrice: number;
  _gasPrice: number;
  private _web3: any;
  private _contracts: any;
  private _abis: any;

  constructor(
    private _storage: Storage,
    private _config: ConfigService,
    private _utils: UtilsService
  ) {
    this.isInit = false;
  }

  async init() {
    this.isInit = true;
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
    const characters = new this._web3.eth.Contract(
      charactersAbi,
      await cryptoblades.methods.characters().call()
    );
    const weapons = new this._web3.eth.Contract(
      weaponsAbi,
      await cryptoblades.methods.weapons().call()
    );
    const quest = new this._web3.eth.Contract(
      questAbi,
      this._config.get('VUE_APP_SIMPLE_QUESTS_CONTRACT_ADDRESS')
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
    const staking = new this._web3.eth.Contract(
      stakingAbi,
      this._config.get('VUE_APP_SKILL2_STAKING_REWARDS_CONTRACT_ADDRESS')
    );
    const skillStaking30 = new this._web3.eth.Contract(
      skillStaking30Abi,
      this._config.get('VUE_APP_SKILL2_STAKING_REWARDS_CONTRACT_ADDRESS')
    );
    const skillStaking90 = new this._web3.eth.Contract(
      skillStaking90Abi,
      this._config.get('VUE_APP_SKILL_STAKING_REWARDS_90_CONTRACT_ADDRESS')
    );
    const skillStaking180 = new this._web3.eth.Contract(
      skillStaking180Abi,
      this._config.get('VUE_APP_SKILL_STAKING_REWARDS_180_CONTRACT_ADDRESS')
    );

    this._contracts = {
      cryptoblades,
      characters,
      weapons,
      quest,
      skill,
      treasury,
      multicall,
      staking,
      skillStaking30,
      skillStaking90,
      skillStaking180,
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
    const { returnData } = await this.getContract('multicall')
      .methods.aggregate(calldata)
      .call();
    const res = returnData.map((call, i) =>
      itf.decodeFunctionResult(calls[i].name, call)
    );
    return res;
  }

  async getSkillPrice() {
    const chain = await this.getChain();
    const contract = this.setContract(
      swapPairAbi,
      this._config.get('SKILL_PAIR_CONTRACT_ADDRESS')
    );
    const reserves = await contract.methods.getReserves().call();
    if (chain === 'OEC' || chain === 'POLYGON') {
      return reserves[0] / reserves[1];
    }
    return reserves[1] / reserves[0];
  }

  async getGasPrice() {
    const chain = await this.getChain();
    const contract = this.setContract(
      swapPairAbi,
      this._config.get('TOKEN_PAIR_CONTRACT_ADDRESS')
    );
    const reserves = await contract.methods.getReserves().call();
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

  async getSkillAssets(accounts) {
    const chain = await this.getChain();
    let staked = [];
    let unclaimed = [];
    let wallet = [];

    if (accounts.length > 0) {
      const accSkillStaked30 = await this.multicall(
        this.getCallData(
          skillStaking30Abi,
          this._config.get('VUE_APP_SKILL2_STAKING_REWARDS_CONTRACT_ADDRESS'),
          'balanceOf',
          accounts.map((acc) => [acc])
        )
      );

      if (chain === 'BNB') {
        const accSkillStaked90 = await this.multicall(
          this.getCallData(
            skillStaking90Abi,
            this._config.get(
              'VUE_APP_SKILL_STAKING_REWARDS_90_CONTRACT_ADDRESS'
            ),
            'balanceOf',
            accounts.map((acc) => [acc])
          )
        );
        const accSkillStaked180 = await this.multicall(
          this.getCallData(
            skillStaking180Abi,
            this._config.get(
              'VUE_APP_SKILL_STAKING_REWARDS_180_CONTRACT_ADDRESS'
            ),
            'balanceOf',
            accounts.map((acc) => [acc])
          )
        );
        staked = accounts.map((acc) =>
          this._utils.sumOfStakedSkill([
            accSkillStaked30[acc],
            accSkillStaked90[acc],
            accSkillStaked180[acc],
          ])
        );
      } else {
        staked = accSkillStaked30;
      }

      unclaimed = await this.multicall(
        this.getCallData(
          cryptoBladesAbi,
          this._config.get('VUE_APP_CRYPTOBLADES_CONTRACT_ADDRESS'),
          'getTokenRewardsFor',
          accounts.map((acc) => [acc])
        )
      );
      wallet = await this.multicall(
        this.getCallData(
          erc20Abi,
          this._config.get('VUE_APP_SKILL_TOKEN_CONTRACT_ADDRESS'),
          'balanceOf',
          accounts.map((acc) => [acc])
        )
      );
    }
    return {
      staked: staked.map(i => this._utils.fromEther(i)),
      unclaimed: unclaimed.map(i => this._utils.fromEther(i)),
      wallet: wallet.map(i => this._utils.fromEther(i)),
    };
  }

  async getSkillPartnerId() {
    const activePartnerIds = await this.getContract('treasury').methods.getActivePartnerProjectsIds().call();

    const skillPartner =  (await this.multicall(
      this.getCallData(
        treasuryAbi,
        this._config.get('VUE_APP_TREASURY_CONTRACT_ADDRESS'),
        'partneredProjects',
        activePartnerIds.map(id => [id])
      ))).find((data) => data[2] === 'SKILL');

    return skillPartner ? BigInt(skillPartner[0]).toString() : false;
}

  async getMultiplier(id) {
    const multiplier = await this.getContract('treasury').methods.getProjectMultiplier(id).call();
    return Number(this._utils.fromEther(multiplier));
  }

  async getGasBalance(address) {
    const balance = await this._web3.eth.getBalance(address);
    return this._utils.fromEther(balance);
  }
}

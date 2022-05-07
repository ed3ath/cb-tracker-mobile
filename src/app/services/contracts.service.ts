import { Injectable } from '@angular/core';
import { Interface } from '@ethersproject/abi';
import { Storage } from '@ionic/storage-angular';
import Web3 from 'web3';
import axios from 'axios';

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
  _isInit: boolean;
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
    this._isInit = false;
  }

  async init() {
    const chain = await this.getChain();
    this._abis = {
      cryptoblades: cryptoBladesAbi,
      skill: erc20Abi,
      treasury: treasuryAbi,
      multicall: multiCallAbi,
    };

    const rpc = this._config.get(chain, 'rpcUrls');

    this._web3 = new Web3(rpc[0]);

    const cryptoblades = new this._web3.eth.Contract(
      cryptoBladesAbi,
      this._config.get(chain, 'VUE_APP_CRYPTOBLADES_CONTRACT_ADDRESS')
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
      this._config.get(chain, 'VUE_APP_SIMPLE_QUESTS_CONTRACT_ADDRESS')
    );
    const skill = new this._web3.eth.Contract(
      erc20Abi,
      this._config.get(chain, 'VUE_APP_SKILL_TOKEN_CONTRACT_ADDRESS')
    );
    const treasury = new this._web3.eth.Contract(
      treasuryAbi,
      this._config.get(chain, 'VUE_APP_TREASURY_CONTRACT_ADDRESS')
    );
    const multicall = new this._web3.eth.Contract(
      multiCallAbi,
      this._config.get(chain, 'VUE_APP_MULTICALL_CONTRACT_ADDRESS')
    );
    const staking = new this._web3.eth.Contract(
      stakingAbi,
      this._config.get(chain, 'VUE_APP_SKILL2_STAKING_REWARDS_CONTRACT_ADDRESS')
    );
    const skillStaking30 = new this._web3.eth.Contract(
      skillStaking30Abi,
      this._config.get(chain, 'VUE_APP_SKILL2_STAKING_REWARDS_CONTRACT_ADDRESS')
    );
    const skillStaking90 = new this._web3.eth.Contract(
      skillStaking90Abi,
      this._config.get(
        chain,
        'VUE_APP_SKILL_STAKING_REWARDS_90_CONTRACT_ADDRESS'
      )
    );
    const skillStaking180 = new this._web3.eth.Contract(
      skillStaking180Abi,
      this._config.get(
        chain,
        'VUE_APP_SKILL_STAKING_REWARDS_180_CONTRACT_ADDRESS'
      )
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
    this._isInit = true;
  }

  setContract(abi: any, address: string) {
    return new this._web3.eth.Contract(abi, address);
  }

  async getChain() {
    return (await this._storage.get('network')) || 'BNB';
  }

  async setChain(chain: string) {
    if (config.supportedChains.includes(chain)) {
      this._isInit = false;
      await this._storage.set('network', chain);
      await this.init();
    }
  }

  async getCurrency() {
    return (await this._storage.get('currency')) || 'usd';
  }

  async setCurrency(currency: string) {
    await this._storage.set('currency', currency);
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

  async getSkillPrice(chain) {
    const contract = this.setContract(
      swapPairAbi,
      this._config.get(chain, 'SKILL_PAIR_CONTRACT_ADDRESS')
    );
    const reserves = await contract.methods.getReserves().call();
    if (chain === 'OEC' || chain === 'POLYGON' || chain === 'AURORA') {
      return reserves[0] / reserves[1];
    }
    return reserves[1] / reserves[0];
  }

  async getGasPrice(chain) {
    if (chain !== 'AURORA') {
      const contract = this.setContract(
        swapPairAbi,
        this._config.get(chain, 'TOKEN_PAIR_CONTRACT_ADDRESS')
      );
      const reserves = await contract.methods.getReserves().call();
      if (chain === 'OEC') {
        return reserves[0] / reserves[1];
      }
      return reserves[1] / reserves[0];
    } else {
      const price = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd`
      );
      return price.data.near.usd;
    }
  }

  async skillPriceTicker(chain) {
    const currency = await this.getCurrency();
    let skillPrice = await this.getSkillPrice(chain);
    let gasPrice = await this.getGasPrice(chain);

    if (chain === 'POLYGON') {
      gasPrice *= 1000000000000;
      skillPrice *= gasPrice;
    }
    if (chain === 'AVAX') {
      gasPrice *= 1000000000000;
      skillPrice *= 1000000000000;
    }
    if (chain === 'AURORA') {
      skillPrice /= 1000000;
      skillPrice *= gasPrice;
    }
    if (chain === 'BSC') {
      this._skillPrice = skillPrice * gasPrice;
    } else {
      this._skillPrice = skillPrice;
    }
    this._gasPrice = gasPrice;
    if (currency !== 'usd') {
      const localPrice = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=${currency}`
      );
      if (localPrice) {
        this._skillPrice *= localPrice.data.tether[currency];
        this._gasPrice *= localPrice.data.tether[currency];
      }
    }
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
          this._config.get(
            chain,
            'VUE_APP_SKILL2_STAKING_REWARDS_CONTRACT_ADDRESS'
          ),
          'balanceOf',
          accounts.map((acc) => [acc])
        )
      );

      if (chain === 'BNB') {
        const accSkillStaked90 = await this.multicall(
          this.getCallData(
            skillStaking90Abi,
            this._config.get(
              chain,
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
              chain,
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
          this._config.get(chain, 'VUE_APP_CRYPTOBLADES_CONTRACT_ADDRESS'),
          'getTokenRewardsFor',
          accounts.map((acc) => [acc])
        )
      );
      wallet = await this.multicall(
        this.getCallData(
          erc20Abi,
          this._config.get(chain, 'VUE_APP_SKILL_TOKEN_CONTRACT_ADDRESS'),
          'balanceOf',
          accounts.map((acc) => [acc])
        )
      );
    }
    return {
      staked: staked.map((i) => this._utils.fromEther(i)),
      unclaimed: unclaimed.map((i) => this._utils.fromEther(i)),
      wallet: wallet.map((i) => this._utils.fromEther(i)),
    };
  }

  async getSkillPartnerId(chain) {
    const activePartnerIds = await this.getContract('treasury')
      .methods.getActivePartnerProjectsIds()
      .call();

    const skillPartner = (
      await this.multicall(
        this.getCallData(
          treasuryAbi,
          this._config.get(chain, 'VUE_APP_TREASURY_CONTRACT_ADDRESS'),
          'partneredProjects',
          activePartnerIds.map((id) => [id])
        )
      )
    ).find((data) => data[2] === 'SKILL');

    return skillPartner ? BigInt(skillPartner[0]).toString() : false;
  }

  async getMultiplier(id) {
    const multiplier = await this.getContract('treasury')
      .methods.getProjectMultiplier(id)
      .call();
    return Number(this._utils.fromEther(multiplier));
  }

  async getGasBalance(address) {
    const balance = await this._web3.eth.getBalance(address);
    return this._utils.fromEther(balance);
  }

  async getAccountCharacters(address) {
    const contract = this.getContract('characters');
    const len = parseInt(await contract.methods.balanceOf(address).call(), 10);
    const characters = await Promise.all(
      [...Array(len).keys()].map((_, i) =>
        contract.methods.tokenOfOwnerByIndex(address, i).call()
      )
    );
    return characters;
  }

  async getAccountWeapons(address) {
    const contract = this.getContract('weapons');
    const len = parseInt(await contract.methods.balanceOf(address).call(), 10);
    const weapons = await Promise.all(
      [...Array(len).keys()].map((_, i) =>
        contract.methods.tokenOfOwnerByIndex(address, i).call()
      )
    );
    return weapons;
  }

  async getCharacterData(charId) {
    const contract = this.getContract('characters');
    return this._utils.characterFromContract(
      charId,
      await contract.methods.get(charId).call()
    );
  }

  async getWeaponData(weapId) {
    const contract = this.getContract('weapons');
    return this._utils.weaponFromContract(
      weapId,
      await contract.methods.get(weapId).call()
    );
  }

  async getTargets(charId, weapId) {
    const contract = this.getContract('cryptoblades');
    return await contract.methods.getTargets(charId, weapId).call();
  }

  async getCharacterPower(charId) {
    const contract = this.getContract('characters');
    return parseInt(await contract.methods.getTotalPower(charId).call(), 10);
  }

  async getCharactersData(charIds) {
    const chain = await this.getChain();
    const charactersAddress = await this.getContract('cryptoblades')
      .methods.characters()
      .call();
    const charsData = (
      await this.multicall(
        this.getCallData(
          charactersAbi,
          charactersAddress,
          'get',
          charIds.map((charId) => [charId])
        )
      )
    ).map((data, i) => this._utils.characterFromContract(charIds[i], data));
    const charsSta = (
      await this.multicall(
        this.getCallData(
          charactersAbi,
          charactersAddress,
          'getStaminaPoints',
          charIds.map((charId) => [charId])
        )
      )
    ).map((sta) => sta[0]);
    const charsPower = await this.multicall(
      this.getCallData(
        charactersAbi,
        charactersAddress,
        'getTotalPower',
        charIds.map((charId) => [charId])
      )
    );
    const charsRep =
      chain !== 'AVAX'
        ? await this.multicall(
            this.getCallData(
              questAbi,
              this._config.get(chain, 'VUE_APP_SIMPLE_QUESTS_CONTRACT_ADDRESS'),
              'getCharacterQuestData',
              charIds.map((charId) => [charId])
            )
          )
        : [];
    const charsExp = await this.getContract('cryptoblades')
      .methods.getXpRewards(charIds)
      .call();

    return {
      charsData,
      charsSta,
      charsPower,
      charsRep,
      charsExp,
    };
  }

  async getReputationLevelRequirements() {
    const conQuest = this.getContract('quest');
    const VAR_REPUTATION_LEVEL_2 = await conQuest.methods
      .VAR_REPUTATION_LEVEL_2()
      .call();
    const VAR_REPUTATION_LEVEL_3 = await conQuest.methods
      .VAR_REPUTATION_LEVEL_3()
      .call();
    const VAR_REPUTATION_LEVEL_4 = await conQuest.methods
      .VAR_REPUTATION_LEVEL_4()
      .call();
    const VAR_REPUTATION_LEVEL_5 = await conQuest.methods
      .VAR_REPUTATION_LEVEL_5()
      .call();
    const requirementsRaw = await conQuest.methods
      .getVars([
        VAR_REPUTATION_LEVEL_2,
        VAR_REPUTATION_LEVEL_3,
        VAR_REPUTATION_LEVEL_4,
        VAR_REPUTATION_LEVEL_5,
      ])
      .call();

    return {
      level2: +requirementsRaw[0],
      level3: +requirementsRaw[1],
      level4: +requirementsRaw[2],
      level5: +requirementsRaw[3],
    };
  }

  getReputationTier(reputation, reputationLevelRequirements) {
    if (Number(reputation) < reputationLevelRequirements.level2) {
      return this._utils.ReputationTier.PEASANT;
    } else if (reputation < reputationLevelRequirements.level3) {
      return this._utils.ReputationTier.TRADESMAN;
    } else if (reputation < reputationLevelRequirements.level4) {
      return this._utils.ReputationTier.NOBLE;
    } else if (reputation < reputationLevelRequirements.level5) {
      return this._utils.ReputationTier.KNIGHT;
    } else {
      return this._utils.ReputationTier.KING;
    }
  }

  async getTokenGainForFight(power, flag = false) {
    const contract = this.getContract('cryptoblades');
    return await contract.methods.getTokenGainForFight(power, flag).call();
  }
}

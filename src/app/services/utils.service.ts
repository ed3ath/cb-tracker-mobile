import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import webUtils from 'web3-utils';
import seedrandom from 'seedrandom';

import * as characterNames from 'src/data/character-names.json';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  public experienceTable;
  public WeaponElement;
  public WeaponTrait;
  public ReputationTier;

  constructor(private _toaster: ToastController) {
    this.experienceTable = [
      16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 33, 36, 39, 42, 46, 50, 55, 60,
      66, 72, 79, 86, 94, 103, 113, 124, 136, 149, 163, 178, 194, 211, 229, 248,
      268, 289, 311, 334, 358, 383, 409, 436, 464, 493, 523, 554, 586, 619, 653,
      688, 724, 761, 799, 838, 878, 919, 961, 1004, 1048, 1093, 1139, 1186,
      1234, 1283, 1333, 1384, 1436, 1489, 1543, 1598, 1654, 1711, 1769, 1828,
      1888, 1949, 2011, 2074, 2138, 2203, 2269, 2336, 2404, 2473, 2543, 2614,
      2686, 2759, 2833, 2908, 2984, 3061, 3139, 3218, 3298, 3379, 3461, 3544,
      3628, 3713, 3799, 3886, 3974, 4063, 4153, 4244, 4336, 4429, 4523, 4618,
      4714, 4811, 4909, 5008, 5108, 5209, 5311, 5414, 5518, 5623, 5729, 5836,
      5944, 6053, 6163, 6274, 6386, 6499, 6613, 6728, 6844, 6961, 7079, 7198,
      7318, 7439, 7561, 7684, 7808, 7933, 8059, 8186, 8314, 8443, 8573, 8704,
      8836, 8969, 9103, 9238, 9374, 9511, 9649, 9788, 9928, 10069, 10211, 10354,
      10498, 10643, 10789, 10936, 11084, 11233, 11383, 11534, 11686, 11839,
      11993, 12148, 12304, 12461, 12619, 12778, 12938, 13099, 13261, 13424,
      13588, 13753, 13919, 14086, 14254, 14423, 14593, 14764, 14936, 15109,
      15283, 15458, 15634, 15811, 15989, 16168, 16348, 16529, 16711, 16894,
      17078, 17263, 17449, 17636, 17824, 18013, 18203, 18394, 18586, 18779,
      18973, 19168, 19364, 19561, 19759, 19958, 20158, 20359, 20561, 20764,
      20968, 21173, 21379, 21586, 21794, 22003, 22213, 22424, 22636, 22849,
      23063, 23278, 23494, 23711, 23929, 24148, 24368, 24589, 24811, 25034,
      25258, 25483, 25709, 25936, 26164, 26393, 26623, 26854, 27086, 27319,
      27553, 27788, 28024, 28261, 28499, 28738, 28978,
    ];
    this.WeaponElement = {
      Fire: 0,
      Earth: 1,
      Lightning: 2,
      Water: 3,
    };

    this.WeaponTrait = {
      STR: 0,
      DEX: 1,
      CHA: 2,
      INT: 3,
      PWR: 4,
    };

    this.ReputationTier = {
      PEASANT: 0,
      TRADESMAN: 1,
      NOBLE: 2,
      KNIGHT: 3,
      KING: 4,
    };
  }

  getNextTargetExpLevel(level) {
    let next = (Math.floor(level / 10) + 1) * 10;
    if (next === level) {
      next = level + 11;
    }
    let exp = 0;
    for (let i = level; i < next; i++) {
      exp += this.experienceTable[i];
    }
    return {
      level: next,
      exp,
    };
  }

  getPotentialXp(charPower, enemyPower, stamina) {
    return Math.floor((enemyPower / charPower) * 32) * stamina;
  }

  getEnemyDetails(targets) {
    return targets.map((data) => {
      const n = parseInt(data, 10);
      return {
        original: data,
        power: n & 16777215,
        trait: n >> 24,
      };
    });
  }

  sumOfArray(arr) {
    let sum = 0;
    arr.forEach((val) => {
      sum += parseFloat(val);
    });
    return sum;
  }

  truncateToDecimals(num, dec = 2) {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  }

  toFixed(num, fixed) {
    const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
  }

  ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  fromEther(value) {
    return webUtils.fromWei(BigInt(Math.trunc(value)).toString(), 'ether');
  }

  toEther(value) {
    return webUtils.toWei(value.toFixed(18), 'ether');
  }

  sumOfStakedSkill(...arr) {
    let total = 0;
    arr.forEach((i) => {
      total += parseFloat(this.fromEther(i));
    });
    return total;
  }

  formatNumber(val, dec = 6) {
    return Number(val).toLocaleString('en', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });
  }

  currencyFormat(value: number, currency = 'USD') {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
  }

  addressPrivacy(address) {
    return `${address.substr(0, 4)}...${address.substr(-4)}`;
  }

  getGasName(network) {
    switch (network) {
      case 'BNB':
        return 'BNB';
      case 'HECO':
        return 'HT';
      case 'OEC':
        return 'OKT';
      case 'POLYGON':
        return 'MATIC';
      case 'AVAX':
        return 'AVAX';
      case 'AURORA':
        return 'AETH';
      default:
        return 'BNB';
    }
  }

  reputationToTier(reputation) {
    switch (reputation) {
      case this.ReputationTier.PEASANT:
        return 'Peasant';
      case this.ReputationTier.TRADESMAN:
        return 'Tradesman';
      case this.ReputationTier.NOBLE:
        return 'Noble';
      case this.ReputationTier.KNIGHT:
        return 'Knight';
      case this.ReputationTier.KING:
        return 'King';
      default:
        return 'Peasant';
    }
  }

  traitNumberToName(traitNum) {
    switch (traitNum) {
      case this.WeaponElement.Fire:
        return 'Fire';
      case this.WeaponElement.Earth:
        return 'Earth';
      case this.WeaponElement.Water:
        return 'Water';
      case this.WeaponElement.Lightning:
        return 'Lightning';
      default:
        return '???';
    }
  }

  characterFromContract(id, data) {
    const xp = data[0];
    const level = parseInt(data[1], 10);
    const trait = data[2];
    const traitName = this.traitNumberToName(+data[2]);
    const staminaTimestamp = data[3];
    const head = data[4];
    const arms = data[5];
    const torso = data[6];
    const legs = data[7];
    const boots = data[8];
    const race = data[9];
    return {
      id: +id,
      xp,
      level,
      trait,
      traitName,
      staminaTimestamp,
      head,
      arms,
      torso,
      legs,
      boots,
      race,
    };
  }

  getStatPatternFromProperties(properties) {
    return (properties >> 5) & 0x7f;
  }

  getStat1Trait(statPattern) {
    return statPattern % 5;
  }

  getStat2Trait(statPattern) {
    return Math.floor(statPattern / 5) % 5;
  }

  getStat3Trait(statPattern) {
    return Math.floor(Math.floor(statPattern / 5) / 5) % 5;
  }

  statNumberToName(statNum) {
    switch (statNum) {
      case this.WeaponTrait.CHA:
        return 'CHA';
      case this.WeaponTrait.DEX:
        return 'DEX';
      case this.WeaponTrait.INT:
        return 'INT';
      case this.WeaponTrait.PWR:
        return 'PWR';
      case this.WeaponTrait.STR:
        return 'STR';
      default:
        return '???';
    }
  }

  getWeaponTraitFromProperties(properties) {
    return (properties >> 3) & 0x3;
  }

  weaponFromContract(id, data) {
    const properties = data[0];
    const stat1 = data[1];
    const stat2 = data[2];
    const stat3 = data[3];
    const level = +data[4];
    const cosmetics = +data[5];
    const blade = (cosmetics & 0xff).toString();
    const crossguard = ((cosmetics >> 8) & 0xff).toString();
    const grip = ((cosmetics >> 16) & 0xff).toString();
    const pommel = ((cosmetics >> 24) & 0xff).toString();
    const burnPoints = +data[6];
    const bonusPower = +data[7];
    const weaponType = +data[8];

    const stat1Value = +stat1;
    const stat2Value = +stat2;
    const stat3Value = +stat3;

    const statPattern = this.getStatPatternFromProperties(+properties);
    const stat1Type = this.getStat1Trait(statPattern);
    const stat2Type = this.getStat2Trait(statPattern);
    const stat3Type = this.getStat3Trait(statPattern);

    const traitNum = this.getWeaponTraitFromProperties(+properties);

    const lowStarBurnPoints = burnPoints & 0xff;
    const fourStarBurnPoints = (burnPoints >> 8) & 0xff;
    const fiveStarBurnPoints = (burnPoints >> 16) & 0xff;

    const stars = +properties & 0x7;
    return {
      id: +id,
      properties,
      trait: traitNum,
      element: this.traitNumberToName(traitNum),
      stat1: this.statNumberToName(stat1Type),
      stat1Value,
      stat1Type,
      stat2: this.statNumberToName(stat2Type),
      stat2Value,
      stat2Type,
      stat3: this.statNumberToName(stat3Type),
      stat3Value,
      stat3Type,
      level,
      blade,
      crossguard,
      grip,
      pommel,
      stars,
      lowStarBurnPoints,
      fourStarBurnPoints,
      fiveStarBurnPoints,
      bonusPower,
      traitNum,
      weaponType,
    };
  }

  getRandom(rng, arr) {
    return arr[Math.floor(rng() * arr.length)];
  }

  getCharacterNameFromSeed(seed) {
    const rng = seedrandom(seed?.toString());

    const firstKey = this.getRandom(rng, ['one', 'two', 'three', 'more']);
    const secondKey = this.getRandom(rng, ['one', 'two', 'three', 'more']);

    const firstName = this.getRandom(rng, characterNames[firstKey]);
    const secondName = this.getRandom(rng, characterNames[secondKey]);

    return `${firstName} ${secondName}`;
  }

  getCharacterPowerByLevel(level) {
    return (1000 + level * 10) * (Math.floor(level / 10) + 1);
  }

  getAlignedCharacterPower(charData, weapData) {
    const playerElement = parseInt(charData.trait, 10);
    const weaponMultiplier = this.GetTotalMultiplierForTrait(weapData, playerElement);
    return charData.power * weaponMultiplier + weapData.bonusPower;
  }

  getElementAdvantage(playerElement, enemyElement) {
    if ((playerElement + 1) % 4 === enemyElement) {return 1;}
    if ((enemyElement + 1) % 4 === playerElement) {return -1;}
    return 0;
  }

  AdjustStatForTrait(statValue, statTrait, charTrait) {
    let value = statValue;
    if (statTrait === charTrait) {value = Math.floor(value * 1.07);}
    else if (statTrait === this.WeaponTrait.PWR) {value = Math.floor(value * 1.03);}
    return value;
  }

  MultiplierPerEffectiveStat(statValue) {
    return statValue * 0.25;
  }

  Stat1PercentForChar(wep, trait) {
    return this.MultiplierPerEffectiveStat(
      this.AdjustStatForTrait(wep.stat1Value, wep.stat1Type, trait)
    );
  }

  Stat2PercentForChar(wep, trait) {
    return this.MultiplierPerEffectiveStat(
      this.AdjustStatForTrait(wep.stat2Value, wep.stat2Type, trait)
    );
  }

  Stat3PercentForChar(wep, trait) {
    return this.MultiplierPerEffectiveStat(
      this.AdjustStatForTrait(wep.stat3Value, wep.stat3Type, trait)
    );
  }

  GetTotalMultiplierForTrait(wep, trait) {
    return (
      1 +
      0.01 *
        (this.Stat1PercentForChar(wep, trait) +
        this.Stat2PercentForChar(wep, trait) +
        this.Stat3PercentForChar(wep, trait))
    );
  }

  async displayToaster(message) {
    this._toaster
      .create({
        message,
        position: 'top',
        cssClass: 'toaster',
        duration: 2000,
        buttons: [
          {
            side: 'end',
            text: 'Close',
            role: 'cancel',
            handler: () => {
              console.log('');
            },
          },
        ],
      })
      .then((toast) => {
        toast.present();
      });
  }
}

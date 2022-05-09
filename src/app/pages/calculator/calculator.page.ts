import { Component } from '@angular/core';

import { ContractService } from 'src/app/services/contracts.service';
import { UtilsService } from 'src/app/services/utils.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-calculator',
  templateUrl: 'calculator.page.html',
  styleUrls: ['calculator.page.scss'],
})
export class CalculatorPage {
  public headerBg = '../../assets/dungeon.jpg';
  public headerTitle = 'REWARDS CALCULATOR';

  _character: number | string;
  _weapon: number | string;
  _daily: any;
  _weekly: any;
  _monthly: any;
  _inLocalCurrency: boolean;

  constructor(
    private _contracts: ContractService,
    private _utils: UtilsService,
    private _storage: StorageService
  ) {
    this.cleanVariables();
  }

  ionViewDidLeave() {
    this.cleanVariables();
  }

  async cleanVariables() {
    this._daily = [];
    this._weekly = [];
    this._monthly = [];
    this._inLocalCurrency = await this._storage.get('localCurrency');
  }

  async runCalculator() {
    const character: any = await this._contracts.getCharacterData(
      this._character
    );
    const weapon = await this._contracts.getWeaponData(this._weapon);
    character.power = await this._contracts.getCharacterPower(this._character);
    const targets = await this._contracts.getTargets(
      this._character,
      this._weapon
    );
    const enemies = await this._utils.getEnemyDetails(targets);
    const currentCurrency = await this._contracts.getCurrency();
    await this._contracts.skillPriceTicker(await this._contracts.getChain());
    const skillPrice = this._contracts._skillPrice;
    const gasPrice = this._contracts._gasPrice;

    const results: any = await Promise.all(
      enemies.map(async (enemy) => {
        const alignedPower = this._utils.getAlignedCharacterPower(
          character,
          weapon
        );
        const skill = this._utils.fromEther(
          (await this._contracts.getTokenGainForFight(enemy.power))
            .toString()
            .split('.')[0]
        );
        const exp = Math.floor((enemy.power / alignedPower) * 32);
        return {
          enemy,
          skill,
          exp,
        };
      })
    );

    let minSkill = 0;
    let maxSkill = 0;
    let minExp = 0;
    let maxExp = 0;

    results.forEach((data) => {
      const skill = Number(data.skill);
      const exp = Number(data.exp);

      if (minSkill === 0) {
        minSkill = skill;
      }
      if (skill > maxSkill) {
        maxSkill = skill;
      }
      if (skill < minSkill) {
        minSkill = skill;
      }

      if (minExp === 0) {
        minExp = exp;
      }
      if (exp > maxExp) {
        maxExp = exp;
      }
      if (exp < minExp) {
        minExp = exp;
      }
    });

    if (this._inLocalCurrency) {
      minSkill *= skillPrice;
      maxSkill *= skillPrice;
    }

    this.cleanVariables();

    for (let i = 7; i > 0; i--) {
      this._daily.push({
        id: i,
        minSkill: !this._inLocalCurrency
          ? parseFloat((minSkill * i).toString()).toFixed(6)
          : this._utils.currencyFormat(
              minSkill * i,
              currentCurrency
            ),
        maxSkill: !this._inLocalCurrency
          ? parseFloat((maxSkill * i).toString()).toFixed(6)
          : this._utils.currencyFormat(
              maxSkill * i,
              currentCurrency
            ),
        minExp: minExp * i,
        maxExp: maxExp * i,
      });
      this._weekly.push({
        id: i,
        minSkill: !this._inLocalCurrency
          ? parseFloat((minSkill * i * 7).toString()).toFixed(6)
          : this._utils.currencyFormat(
              minSkill * i * 7,
              currentCurrency
            ),
        maxSkill: !this._inLocalCurrency
          ? parseFloat((maxSkill * i * 7).toString()).toFixed(6)
          : this._utils.currencyFormat(
              maxSkill * i * 7,
              currentCurrency
            ),
        minExp: minExp * i * 7,
        maxExp: maxExp * i * 7,
      });
      this._monthly.push({
        id: i,
        minSkill: !this._inLocalCurrency
          ? parseFloat((minSkill * i * 30).toString()).toFixed(6)
          : this._utils.currencyFormat(
              minSkill * i * 30,
              currentCurrency
            ),
        maxSkill: !this._inLocalCurrency
          ? parseFloat((maxSkill * i * 30).toString()).toFixed(6)
          : this._utils.currencyFormat(
              maxSkill * i * 30,
              currentCurrency
            ),
        minExp: minExp * i * 30,
        maxExp: maxExp * i * 30,
      });
    }
  }
}

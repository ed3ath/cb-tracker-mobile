import { Component } from '@angular/core';

import { ContractService } from 'src/app/services/contracts.service';
import { UtilsService } from 'src/app/services/utils.service';

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

  constructor(
    private _contracts: ContractService,
    private _utils: UtilsService
  ) {
    this.cleanVariables();
  }

  async ionViewDidLeave() {
    this.cleanVariables();
  }

  cleanVariables() {
    this._daily = [];
    this._weekly = [];
    this._monthly = [];
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

    this.cleanVariables();

    for (let i = 7; i > 0; i--) {
      this._daily.push({
        id: i,
        minSkill: parseFloat((minSkill * i).toString()).toFixed(6),
        maxSkill: parseFloat((maxSkill * i).toString()).toFixed(6),
        minExp: minExp * i,
        maxExp: maxExp * i,
      });
      this._weekly.push({
        id: i,
        minSkill: parseFloat((minSkill * i * 7).toString()).toFixed(6),
        maxSkill: parseFloat((maxSkill * i * 7).toString()).toFixed(6),
        minExp: minExp * i * 7,
        maxExp: maxExp * i * 7,
      });
      this._monthly.push({
        id: i,
        minSkill: parseFloat((minSkill * i * 30).toString()).toFixed(6),
        maxSkill: parseFloat((maxSkill * i * 30).toString()).toFixed(6),
        minExp: minExp * i * 30,
        maxExp: maxExp * i * 30,
      });
    }
  }
}

import { Component } from '@angular/core';
import { ContractService } from 'src/app/services/contracts.service';
import utils from 'web3-utils';
import axios from 'axios';

@Component({
  selector: 'app-treasury',
  templateUrl: 'treasury.page.html',
  styleUrls: ['treasury.page.scss'],
})
export class TreasuryPage {
  _partners;
  constructor(private _contracts: ContractService) {
    this.init();
  }

  async init() {
    await this._contracts.init();

    const treasury = this._contracts.getContract('treasury');
    const partnerIds = await treasury.methods
      .getActivePartnerProjectsIds()
      .call();
    const multiData = this._contracts.getCallData(
      this._contracts.getAbi('treasury'),
      treasury._address,
      'getProjectMultiplier',
      partnerIds.map((id: any) => [id])
    );
    const partnerMult = await this._contracts.multicall(multiData);
    const partnersData = this._contracts.getCallData(
      this._contracts.getAbi('treasury'),
      treasury._address,
      'partneredProjects',
      partnerIds.map((id: any) => [id])
    );
    this._partners = (await this._contracts.multicall(partnersData)).map(
      (partner, i) => ({
        name: partner.name,
        symbol: partner.tokenSymbol,
        price: parseFloat(
          utils.fromWei(BigInt(partner.tokenPrice).toString(), 'ether')
        ).toFixed(8),
        supply: utils.fromWei(BigInt(partner.tokenSupply).toString(), 'ether'),
        multiplier: parseFloat(
          utils.fromWei(BigInt(partnerMult[i]).toString(), 'ether')
        ).toFixed(5),
      })
    );
  }
}

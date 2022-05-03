import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/services/contracts.service';

@Component({
  selector: 'app-splash',
  templateUrl: 'splash.page.html',
  styleUrls: ['splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(private _contracts: ContractService, private router: Router) {}

  async ngOnInit() {
    await this.checkContractInit();
  }

  async checkContractInit() {
    if (!this._contracts.isInit) {
      return await this.checkContractInit();
    } else {
      console.log('navigating to dashboard');
      setTimeout(() => this.router.navigate(['/tabs/dashboard']), 3000);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { ContractService } from 'src/app/services/contracts.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  activeTab = 'dashboard';
  _currencies: any;
  _currentCurrency: string;
  _chain: string;

  constructor(
    private router: Router,
    private menu: MenuController,
    private _contracts: ContractService,
  ) {
    this._chain = '';
    this._currentCurrency = '';
  }

  async ngOnInit() {
    this._chain = await this._contracts.getChain();
    this._currentCurrency = await this._contracts.getCurrency();
  }

  navigateTo(url) {
    this.activeTab = url;
    this.router.navigate(['tabs/' + url]);
    this.menu.close();
  }
}

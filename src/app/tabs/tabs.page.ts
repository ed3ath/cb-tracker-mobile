import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  activeTab = '';

  constructor(private router: Router) { }

  gotoDashBoard(){
    this.router.navigate(['tabs/dashboard']);
  }

  selectedTab(tab){
    this.activeTab = tab;
    console.log(this.activeTab);
  }
}

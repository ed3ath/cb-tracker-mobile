import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  activeTab ='accounts';
  constructor(private router: Router, private menu: MenuController) { }

  ngOnInit() {}

  navigateTo(url){
    this.activeTab = url;
    this.router.navigate(['tabs/'+url]);
    this.menu.close();
  }

}

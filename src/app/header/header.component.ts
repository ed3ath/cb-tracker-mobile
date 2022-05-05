import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() subHeaderBg: string;
  @Input() headerTitle: string;

  public mainLogo = '../../assets/cbt-logo.png';
  public burgerMenu = '../../assets/burger-menu.svg';
  constructor() { }

  ngOnInit() {}

}

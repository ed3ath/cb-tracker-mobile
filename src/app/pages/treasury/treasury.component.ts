import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-treasury',
  templateUrl: './treasury.component.html',
  styleUrls: ['./treasury.component.scss'],
})
export class TreasuryComponent implements OnInit {

  public headerBg = '../../assets/dungeon.jpg';
  public headerTitle = 'TREASURY INFORMATION';

  constructor() { }

  ngOnInit() {}

}

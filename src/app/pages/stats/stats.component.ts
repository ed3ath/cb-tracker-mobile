import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {

  public headerBg = '../../assets/dungeon.jpg';
  public headerTitle = 'CRYPTOBLADES STATS';

  constructor() { }

  ngOnInit() {}

}

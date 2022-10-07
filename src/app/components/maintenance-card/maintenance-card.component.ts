import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-maintenance-card',
  templateUrl: './maintenance-card.component.html',
  styleUrls: ['./maintenance-card.component.scss']
})
export class MaintenanceCardComponent implements OnInit {

  @Input() title: string='';
  constructor() { }

  ngOnInit(): void {
  }

}

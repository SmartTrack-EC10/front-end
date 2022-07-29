import { Component, OnInit, Input, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { GeofenceStruct } from '../newSmartRules.component'

import * as L from 'leaflet';

@Component({
  selector: 'map-rule',
  templateUrl: './mapRule.component.html',
  styleUrls: ['./mapRule.component.scss']
})

export class MapRuleComponent implements OnInit, AfterContentInit {
  @Input() selectedRuleType: string = "";  
  @Output() geoStructSend = new EventEmitter<GeofenceStruct>();

  map: any;
  geoStruct: GeofenceStruct = { georel: "", geometry: "polygon", coords: "" }

  georeltypeList: string[] = ["coveredBy", "intersects", "equals"];

  constructor() {
  }

  ngOnInit(): void {
    
  }

  ngAfterContentInit(): void {
    this.map = L.map('mapLeaflet', {
      center: [-23.5489, -46.6388],
      zoom: 10
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  onClose(): void {
  }

  openPopupGeonfece(): void{
  }
}

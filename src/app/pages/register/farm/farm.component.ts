import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.scss'],
})
export class FarmComponent implements AfterViewInit {
  private map: any;
  private latlngs: [number, number][] = [];

  private initMap(): void {
    this.map = L.map('map', {
      center: [-23.740417335211276, -46.58371833281692],
      zoom: 16,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      this.latlngs.push([e.latlng.lat, e.latlng.lng]);
      if (this.latlngs.length >= 3) {
        L.polygon(this.latlngs, { color: 'red' }).addTo(this.map);
      }
    });
  }
  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }
}

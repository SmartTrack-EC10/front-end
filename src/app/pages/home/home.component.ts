import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  private map: any;

  private initMap(): void {
    this.map = L.map('map', {
      center: [-23.740417335211276, -46.58371833281692],
      zoom: 19,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.map);


    L.marker([-23.740417335211276, -46.58371833281692]).addTo(this.map)
    .bindPopup('FTT')
  }
  constructor() {}
  ngAfterViewInit(): void {
    this.initMap();
  }
}

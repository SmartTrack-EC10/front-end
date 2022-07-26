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
      zoom: 16,
    });

    let latlngs: [number, number][] = [
      [-23.735449970765345, -46.58474797954481],
      [-23.737286170531984, -46.58483410375991],
      [-23.738435244132525, -46.58542418973708],
      [-23.740340523324633, -46.58486629026776],
      [-23.740870853812417, -46.583557372282066],
      [-23.739250392764305, -46.5826990654062],
      [-23.73692278617311, -46.583578829953964],
      [-23.735439774633413, -46.582988743976806],
    ];
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    let icon = L.icon({
      iconUrl: '../assets/images/tractor-icon.png',
      iconSize: [40, 38],
    });

    L.marker([-23.740417335211276, -46.58371833281692], { icon: icon })
      .addTo(this.map)
      .bindPopup('FTT');

    L.polygon(latlngs, { color: 'red' }).addTo(this.map).bindPopup('FTT1');

    this.map.on('click', function(e: { latlng: { lat: string; lng: string; }; }) {
      console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
  });

  }
  constructor() {}
  ngAfterViewInit(): void {
    this.initMap();
  }
}

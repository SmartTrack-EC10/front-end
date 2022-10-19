import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import * as L from 'leaflet';
import { TruckApiService } from 'src/app/core/services/truck-service/truck-api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, interval, map, Observable, startWith, Subject, Subscription } from 'rxjs';
import { ParcelApiService } from 'src/app/core/services/parcel-service/parcel-api.service';
import { FormControl } from '@angular/forms';
import { AgriFarmApiService } from 'src/app/core/services/agriFarm-service/agriFarm.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  subscription: Subscription;
  myControl = new FormControl('');
  options: any[] = []
  filteredOptions: Observable<any[]>;
  constructor(private service: TruckApiService,
    private spinner: NgxSpinnerService,
    private parcelService: ParcelApiService
    , private farmService: AgriFarmApiService) { }
  battery: any[] = [{
    "name": "Bateria",
    "value": 0
  }];
  hours: any[] = [{
    "name": "Horas",
    "value": 0
  }];

  lat = 0
  lng = 0
  location = 'Fazenda'
  id = ''

  position: any[] = []

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#48ffd5'],
  };


  cardColor: string = '#fff';

  private map: any;
  marker: any;

  private initMap(): void {
    this.map = L.map('map', {
      center: [-23.740417335211276, -46.58371833281692],
      zoom: 18,
    });
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution:
        'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    }).addTo(this.map);

    let icon = L.icon({
      iconUrl: '../assets/images/logo.png',
      iconSize: [40, 38],
    });

    this.marker = L.marker([-23.740417335211276, -46.58371833281692], { icon: icon })
      .addTo(this.map)
      .bindPopup('FTT');

  }
  data: any[] = []
  ngOnInit(): void {
    const source = interval(120000)
    this.spinner.show()
    this.getTrucks()
    this.subscription = source.subscribe(() => {
      this.spinner.show()
      this.fetchTruck(this.id)
    });



  }
  _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.alias.value.toLowerCase().includes(filterValue));
  }

  getTrucks() {
    this.spinner.show()
    this.service.getAllTrucks()
      .pipe(finalize(() => {
        this.update(this.data)
        this.spinner.hide()
      }))
      .subscribe((res) => {
        this.options = [...res]
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );
        this.data = res;
        this.id = res[0].id
        this.getParcel(res[0].relatedParcel.value)
        this.getFarm(res[0].relatedFarm.value)
      })
  }

  getParcel(id: string) {
    this.parcelService.getParcelById(id)
      .pipe(finalize(() => {
        this.spinner.hide()
      })).subscribe((res) => {
        let latlngs: [number, number][] = []
        latlngs.push(res[0].location.value.map((point: any) => {
          let p = point.split(', ')
          console.log(parseFloat(p[0]), parseFloat(p[1]))
          return ([parseFloat(p[0]), parseFloat(p[1])])
        }))
        L.polygon(latlngs, { color: '#48ffd5' }).addTo(this.map).bindPopup(res[0].alias.value);
      })
  }

  getFarm(id: string) {
    this.farmService.getFarmById(id)
      .pipe(finalize(() => {
        this.spinner.hide()
      })).subscribe((res) => {
        this.location = res[0].alias.value
      })
  }
  onRecive() {

  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  update(response: any) {
    let prop = [{
      "name": "Bateria",
      "value": response[0].battery.value
    }]
    this.battery = [...prop]
    let propq = [{
      "name": "Horas",
      "value": response[0].workedHours.value
    }]
    this.hours = [...propq]
    let cords = response[0].location.value.split(',')
    this.lat = cords[0]
    this.lng = cords[1]
    let newLatLng = new L.LatLng(this.lat, this.lng);
    this.marker.setLatLng(newLatLng);
    this.marker.bindPopup(response[0].alias.value)
    this.map.panTo(newLatLng);
  }
  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  fetchTruck(id: string) {
    this.spinner.show()
    this.id = id ? id : this.id
    this.service.getTruckById(this.id)
      .pipe(finalize(() => {
        this.update(this.data)
        this.spinner.hide()
      }))
      .subscribe((res) => {
        this.data = res;

        this.getParcel(res[0].relatedParcel.value)
        this.getFarm(res[0].relatedFarm.value)
      })
  }
}

import { Component, AfterViewInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent, DialogData } from "../../../../../dialog/dialog.component"
import { HttpParams } from '@angular/common/http';

import { AgriParcelApiService } from 'src/app/core/services/agriParcel-service/agriParcel.service'

import * as L from 'leaflet';
import { LIVE_ANNOUNCER_ELEMENT_TOKEN_FACTORY } from '@angular/cdk/a11y';

export interface mapPointsData {
  agriFarm: any[]
}

interface PolygonAgriObject {
  polygon: any,
  object: any
}

//Map Marker Icon configuration
const iconDefault = L.icon({
    iconRetinaUrl: "../assets/images/marker-icon2x.png",
    iconUrl: "../assets/images/marker-icon.png",
    shadowUrl: "../assets/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  templateUrl: './dialogMapPoints.component.html',
  styleUrls: ['./dialogMapPoints.component.scss']
})

export class DialogMapPointsComponent implements AfterViewInit{
  objReturn: any = '';
  
  hasMoreAgriParcel: boolean = true;
  enableSave: boolean = false;
  lsAgriFarm: any[] = [];
  lsAgriParcel: any[] = []; //from current farm selected
  agriFarmObject: any = "";
  lsMarkers: L.Marker[] = [];
  latlongBoundFarm: L.LatLngBounds[] = [];

  private map: any;
  private drawItems: L.FeatureGroup = new L.FeatureGroup(); //add a lot layers on the map

  private polygon: L.Polygon = L.polygon([[]]);
  private polygonCustomerOptions: L.PolylineOptions = {
    stroke: true,
    color: "#45B3FF",
    weight: 1,
    opacity: 0.5,
    fill: true,
    fillColor: "#45B3FF",
    fillOpacity: 0.5,
    fillRule: "evenodd"
  };

  private polygonFarmParcel: PolygonAgriObject[] = [];
  private polygonFarmParcelOptions: L.PolylineOptions = {
    stroke: true,
    color: "#203EFC",
    weight: 2,
    opacity: 0.5,
    fill: true,
    fillColor: "#203EFC",
    fillOpacity: 0.2,
    fillRule: "evenodd"
  };

  constructor(private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogMapPointsComponent>, 
    @Inject(MAT_DIALOG_DATA) public mapPointsData: any[],
    private serviceAgriParcel: AgriParcelApiService) 
  { 
    dialogRef.disableClose = true; //disable click out to close   

    this.lsAgriFarm = mapPointsData;
  }

  ngAfterViewInit(): void {
      this.initMap();
  }

  //initicialize the map on screen
  initMap(): void {
    if(!this.map){
      this.map = L.map('mapLeafletPoints').fitWorld();
  
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {        
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
  
      tiles.addTo(this.map);
      this.map.addLayer(this.drawItems);
    }
  }

  //draw the Farm/Parcel Polygons
  drawCurrentPolygons(object: any) {
    var coord: [number, number];

    if((object as Object).hasOwnProperty("location")){
      var lsCoord: any[] = object.location;
      var latlong: [number, number][] = [[0, 0]]; 
      latlong.pop(); 

      lsCoord.forEach(value => {
        coord = value.split(","); 
        latlong.push(coord);
      })

      this.polygonFarmParcel.push( {
        polygon: L.polygon(latlong, this.polygonFarmParcelOptions)
        .addTo(this.drawItems)
        .addEventListener("click", event => {this.objReturn = object; this.enableSave = true})
        .bindPopup(this.bindPopupGeofence(object)),
        object: object        
      });

      if(object.type == "AgriFarm") { 
        this.latlongBoundFarm.push(this.polygonFarmParcel[this.polygonFarmParcel.length-1].polygon.getBounds()) 
      }  
    }
  }

  bindPopupGeofence(object: any): string{
    var pagePopup = "";
    
    pagePopup += `<div>Alias: <strong>${object.alias}</strong> </div>`;
    pagePopup += `<div>Type: ${object.type} </div>`;
    pagePopup += `<div>Description: ${object.description.substring(0, 15)} ... </div>`;

    if(object.type == "AgriFarm")
    {
      pagePopup += `<div>Culture: ${object.culture[0]}, ... </div>`;
    }
    else if(object.type == "AgriParcel") {
      pagePopup += `<div>Status: ${object.status} </div>`;
      pagePopup += `<div>LastPlantedAt: ${object.lastPlantedAt} </div>`; 
    }

    return pagePopup;
  }
  
  clearOldParameters() {
    //remove lines/polygon
    this.polygonFarmParcel.forEach(polygon => {
      polygon.polygon.removeFrom(this.map);
    })
    
    this.polygonFarmParcel = [];
    this.latlongBoundFarm = [];
    this.lsAgriParcel = [];
  }

  centerMap(): void {   
    if(this.latlongBoundFarm.length != 0){    
      this.map.fitBounds(this.latlongBoundFarm[0]);
    }
  }

  //get all Farm's parcel
  getAgriParcelList(): void {
    this.clearOldParameters(); //clear before to draw the news polygons

    this.drawCurrentPolygons(this.agriFarmObject); //build first the farm

    var listServer: any[] = [];

    var httpParams = new HttpParams().set('q', `belongsTo==${this.agriFarmObject.id}`)
    .set('type', 'AgriParcel').set('options', 'keyValues').set('offset', 0).set('limit', 5);

    //while(this.hasMoreAgriParcel){
      this.serviceAgriParcel.getParcelsQuery(httpParams).subscribe(data => { 
        listServer = data;

        if(listServer.length == 0 ) { this.hasMoreAgriParcel = false } //disable butons if all data is already downloaded
        else { 
          listServer.forEach(parcel => { this.lsAgriParcel.push(parcel) });          

          this.lsAgriParcel.forEach(parcel => this.drawCurrentPolygons(parcel)); //after loaded all parcel, draw then.
          
          this.centerMap(); //center farm on map
        }
      });
    //}
  }

  //close the dialog
  onCancel() {
    this.dialogRef.close();
  }

  //clear all points generate by customer
  onClearPoints() {
    //remove markers
    this.lsMarkers.forEach(marker => {
      marker.removeFrom(this.map);
    })
    this.lsMarkers = []

    //remove lines/polygon
    this.polygon.removeFrom(this.map);
    this.polygon = L.polygon([[]]);
    this.polygon.options = this.polygonCustomerOptions;

    this.polygon.addTo(this.map);
  }

  //close dialog and send the new coordenates
  saveCoordenates() {
    this.dialogRef.close(this.objReturn);
  }

  //show messages of error
  showMessageDialog(strMessage: string, strType: string): void {
    var dataDialog: DialogData = {message: strMessage, type: strType };
    var config = {
      data: dataDialog,
      width: '250px'
    }

    this.dialog.open(DialogComponent, config);       
  }
}

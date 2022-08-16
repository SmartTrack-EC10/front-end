import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GeofenceStruct } from '../newSmartRules.component'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DialogComponent, DialogData } from "../../../../dialog/dialog.component"
import { AgriFarmApiService } from "src/app/core/services/agriFarm-service/agriFarm.service"
import { DialogMapPointsComponent } from './dialogMapPoints/dialogMapPoints.component'

import * as L from 'leaflet';

//Map Marker Icon configuration
const iconDefault = L.icon({
  iconRetinaUrl: '../assets/images/marker-icon2x.png',
  iconUrl: "../assets/images/marker-icon.png",
  shadowUrl: "../assets/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

@Component({
  selector: 'map-rule',
  templateUrl: './mapRule.component.html',
  styleUrls: ['./mapRule.component.scss']
})

export class MapRuleComponent {

  @Input() selectedRuleType: string = "";  
  @Input() selectedEntitiesType: string = ""; 
  @Output() geoStructSend = new EventEmitter<GeofenceStruct>();

  georelRule: string = "";
 
  geoStruct: GeofenceStruct = { georel: "", geometry: "polygon", coords: "" }
  georeltypeList: string[] = ["coveredBy", "intersects", "equals"];
  agrifarmlList: any[] = [];
  hasMoreAgriFarm: boolean = true;
  correctObjReturn: boolean = false;

  objReturned: any = "";

  private map: any;
  private polygonSmartRule: L.Polygon = L.polygon([[]]);
  private polygonOptions: L.PolylineOptions = {
    stroke: true,
    color: "#45B3FF",
    weight: 1,
    opacity: 0.5,
    fill: true,
    fillColor: "#45B3FF",
    fillOpacity: 0.5,
    fillRule: "evenodd"
  };

  constructor(private dialog: MatDialog, private serviceAgrifarm: AgriFarmApiService)  {}

  initMap(): void {
    if(!this.map){ 
      this.map = L.map('mapLeaflet', {
        center: [ 39.8282, -98.5795 ],
        zoom: 3
      });
  
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
  
      tiles.addTo(this.map);

      this.getAgriFarmList();
    }
  }
  
  openPopupGeonfece(): void { 
    let dialogRef = this.dialog.open(DialogMapPointsComponent, {data: this.agrifarmlList});

    dialogRef.afterClosed().subscribe(result => {
      this.objReturned = result;
      this.drawCurrentPolygons(result)
    });
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

      //remove the last coord, because in the helix first and last coord must be the same
      lsCoord.pop();
    
      this.polygonSmartRule = L.polygon(latlong, this.polygonOptions)
      .bindTooltip(`<div>Alias: <strong>${object.alias}</strong></div>`)
      .addTo(this.map);
      this.map.fitBounds(this.polygonSmartRule.getBounds());
    }
  }

  getAgriFarmList(): void {
    var listServer: any[] = [];
    //while(this.hasMoreAgriFarm){      
      this.serviceAgrifarm.getFarms(this.agrifarmlList.length).subscribe(data => { 
        listServer = data; 
        if(listServer.length == 0 ) { this.hasMoreAgriFarm = false } //disable butons if all data is already downloaded
        else { listServer.forEach(farm => { this.agrifarmlList.push(farm) }); };   
      });
    //}
  }

  validateFields(): boolean {    
    if(this.geoStruct.coords.length <= 3){      
      this.showMessageDialog("Please, select the Geofence", "Warning");
      return false;
    }      
    else if(!this.geoStruct.georel) {
      this.showMessageDialog("Please, select the Georel Rule", "Warning");
      return false;
    }
    return true;
  }

  buildObjectToReturn(): boolean {
    if((this.objReturned as Object).hasOwnProperty("location")){
      (this.objReturned.location as Array<String>).forEach(coord => {
        this.geoStruct.coords += coord + "; ";
      });

      //helix needs that first and last points is the same
      this.geoStruct.coords += this.objReturned.location[0];
    }
    else{ 
      this.showMessageDialog("Please, select the Geofence", "Warning");
      return false;
    }

    if(this.georelRule.length != 0){
      this.geoStruct.georel = this.georelRule;
    }
    else{
      this.showMessageDialog("Please, select the Geofence", "Warning");
      return false;
    }

    return true;
  }

  openGeorelDescription() {
    this.dialog.open(DialogGeorelDescription);
  }

  onUpdate() {
    this.correctObjReturn = false;
  }

  onSave() {
    if(this.buildObjectToReturn() && this.validateFields()){
      this.correctObjReturn = true;
      this.geoStructSend.emit(this.geoStruct);
    }      
    else {
      this.correctObjReturn = false;
    }     
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

@Component({
  selector: 'dialog-georel-description',
  templateUrl: 'dialogGeorelDescription.component.html',
}) 

export class DialogGeorelDescription {
  constructor(public dialogRef: MatDialogRef<DialogGeorelDescription>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}

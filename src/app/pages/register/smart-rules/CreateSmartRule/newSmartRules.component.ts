import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogComponent, DialogData } from 'src/app/pages/dialog/dialog.component'

import { SmartRuleApiService } from 'src/app/core/services/smart-rules-service/smart-rule-api.service';
import { TruckApiService } from 'src/app/core/services/truck-service/truck-api.service';
import { UserApiService } from 'src/app/core/services/user-service/user-api.service';
import { AgriFarmApiService } from 'src/app/core/services/agriFarm-service/agriFarm.service';
import { AgriParcelApiService } from 'src/app/core/services/agriParcel-service/agriParcel.service';
import { environment } from 'src/environments/environment';

export interface OptionsList { object: any, status: boolean }
export interface MeasurementsStruct { field: string, operation: string, value: string }
export interface MeasurementsCondition { attrs: string[], expression: {q: string} }
export interface GeofenceStruct { georel: string, geometry: string, coords: string }
export interface GeofenceCondition { attrs: string[], expression: { georel: string, geometry: string, coords: string } }

@Component({
  selector: 'new-smart-rules',
  templateUrl: './newSmartRules.component.html',
  styleUrls: ['./newSmartRules.component.scss']
})

export class NewSmartRulesComponent implements OnInit {
  pageForm: FormGroup;

  gridSize: number = 1;

  entitiesTypes: string[] = ['Person', 'Truck', 'AgriFarm', 'AgriParcel'];
  entitiesIsPattern: string[] = ['All', 'Devices'];

  selectedPattern: string = "";
  selectedRuleType: string = "";
  selectedEntitiesType: string = "";

   //enable or disable buttons
  isValidPersonList: boolean = false;
  hasMorePerson: boolean = true;

  isValidTruckList: boolean = false;
  hasMoreTruck: boolean = true;

  isValidAgriFarmList: boolean = false;
  hasMoreAgriFarm: boolean = true;

  isValidAgriParcelList: boolean = false;
  hasMoreAgriParcel: boolean = true;

  isObjectToSendValid: boolean = true; //Is valid object to send?

  conditionMeasuremenst: MeasurementsCondition = {attrs: [], expression: {q: ""}};
  conditionGeofence: GeofenceCondition = {attrs: [], expression: { georel: "", geometry: "", coords: "" }};

  personOptions: OptionsList[] = [];
  truckOptions: OptionsList[] = [];
  agriFarmOptions: OptionsList[] = [];
  agriParcelOptions: OptionsList[] = [];

  constructor(private fb: FormBuilder,
    private servicePerson: UserApiService,
    private serviceTruck: TruckApiService,
    private serviceAgrifarm: AgriFarmApiService,
    private serviceAgriParcel: AgriParcelApiService,
    private serviceSmartRule: SmartRuleApiService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog) {

    this.pageForm = this.fb.group({
      description: [''],
      message: [''],
      entitiesType: [''], //('Person', 'Truck', 'AgriFarm', 'AgriParcel')
      isPattern: [''],    //('All', 'Trucks')
      isRuleType: [''],   //('Measurements', 'Geofence')      
      expired: ['']
    });
  }

  ngOnInit(): void {      
  }

  //get all entities to send in payload
  getEntitiesObject(pageForm: any): any[] {
    var entities: any[] = []

    //Use pattern to select all entities' type
    if(this.selectedPattern == "All") {
      entities = [{
        idPattern: "urn:ngsi-ld:" + pageForm.entitiesType + ":*",
        type: pageForm.entitiesType
      }];
    }
    //get each entitite from truck and create a list
    else {
      this.truckOptions.forEach(truck => {
        if(truck.status){
          entities.push({
            id: "urn:ngsi-ld:" + pageForm.entitiesType + ":" + truck.object.id,
            isPattern: false,
            type: pageForm.entitiesType
          })
        }        
      });
    }
    
    return entities;
  }

  //get default msg payload to send like a JSON
  getPayloadstring(strMessage: string): string {
    var strDevice = "{%22message%22:%22" + strMessage + "%22," + //check here to set the message to send by notifications
      "%22id%22:%22${id}%22," + 
      "%22type%22:%22${type}%22," +
      "%22TimeInstant%22:%22${TimeInstant}%22," + 
      "%22alias%22:%22${alias}%22," + 
      "%22battery%22:%22${battery}%22," +
      "%22dataTruck%22:${dataTruck}," + 
      "%22fuel%22: %22${fuel}%22," + 
      "%22greenLight_info%22: %22${greenLight_info}%22," +
      "%22greenLight_status%22:%22${greenLight_status}%22," + 
      "%22lastMaintenance%22: ${lastMaintenance}," +
      "%22location%22:%22${location}%22," + 
      "%22motionDetection%22:%22${motionDetection}%22," +
      "%22motorTemperature%22:%22${motorTemperature}%22," + 
      "%22ownedBy%22:%22${ownedBy}%22," +
      "%22redLight_info%22:%22${redLight_info}%22," + 
      "%22redLight_status%22:%22${redLight_status}%22," +
      "%22relatedFarm%22:%22${relatedFarm}%22," + 
      "%22relatedParcel%22:%22${relatedParcel}%22," +
      "%22workedHours%22:%22${workedHours}%22," + 
      "%22yellowLight_info%22:%22${yellowLight_info}%22," +
      "%22yellowLight_status%22:%22${yellowLight_status}%22}";

    return strDevice;
  }

  //condition to gerenerate notifications
  getCondition(): any {
    var condition = {}
    console.log(this.selectedRuleType)
    if(this.selectedRuleType == "Measurements"){
      condition = this.conditionMeasuremenst;
    }
    else if(this.selectedRuleType == "Geofence"){
      console.log(this.conditionGeofence)
      condition = this.conditionGeofence;
    }
    else{
      this.isObjectToSendValid = false;
    }

    return condition;
  }

  //Build Person list to be selected by customer
  buildPersonList(bIsChangeTime: boolean): any {
    var listServer: any[] = [];
    var personLength: number = this.personOptions.length;
    if(bIsChangeTime && personLength == 0) //when change, do it for firstTime
    {
      this.servicePerson.getPerson(personLength).subscribe(data => { 
        listServer = data; 
        if(listServer.length == 0 ) { this.hasMorePerson = false } //disable butons if all data is already downloaded
        else { listServer.forEach(person => { this.personOptions.push({ object: person, status: false }) }) };
      }); 
    }
    else if(!bIsChangeTime) {
      this.servicePerson.getPerson(personLength).subscribe(data => { //when customer want to see more objects
        listServer = data; 
        if(listServer.length == 0 ) { this.hasMorePerson = false } //disable butons if all data is already downloaded
        else { listServer.forEach(person => { this.personOptions.push({ object: person, status: false }) }) }; 
      });
    }
  }

  //Build Truck list to be selected by customer
  buildTruckList(bIsChangeTime: boolean): any {
    var listServer: any[] = [];
    var truckLength: number = this.truckOptions.length;
    if(bIsChangeTime && truckLength == 0) //when change, do it for firstTime
    {
      this.serviceTruck.getTrucks(truckLength).subscribe(data => { 
        listServer = data; 
        if(listServer.length == 0 ) { this.hasMoreTruck = false } //disable butons if all data is already downloaded
        else { listServer.forEach(truck => { this.truckOptions.push({ object: truck, status: false }) }) };
      });
    }
    else if(!bIsChangeTime) { //when change, do it for firstTime
      this.serviceTruck.getTrucks(truckLength).subscribe(data => { 
        listServer = data; 
        if(listServer.length == 0 ) { this.hasMoreTruck = false } //disable butons if all data is already downloaded
        else { listServer.forEach(truck => { this.truckOptions.push({ object: truck, status: false }) }) };
      });
    }
  }
  
  //Build AgriParcel list to be selected by customer
  buildAgriParcelList(bIsChangeTime: boolean): any {
    var listServer: any[] = [];
    var parcelLength: number = this.agriParcelOptions.length;
    if(bIsChangeTime && parcelLength == 0) //when change, do it for firstTime
    {
      this.serviceAgriParcel.getParcels(parcelLength).subscribe(data => { 
        listServer = data; 
        if(listServer.length == 0 ) { this.hasMoreAgriParcel = false } //disable butons if all data is already downloaded
        else { listServer.forEach(parcel => { this.agriParcelOptions.push({ object: parcel, status: false }) }) };
      });
    }  
    else if(!bIsChangeTime) { //when change, do it for firstTime
      this.serviceAgriParcel.getParcels(parcelLength).subscribe(data => { 
        listServer = data; 
        if(listServer.length == 0 ) { this.hasMoreAgriParcel = false } //disable butons if all data is already downloaded
        else { listServer.forEach(parcel => { this.agriParcelOptions.push({ object: parcel, status: false }) }) };
      });
    }
  }

  //Build Agrifarm list to be selected by customer
  buildAgriFarmList(bIsChangeTime: boolean): any {
    var listServer: any[] = [];
    var farmLength: number = this.agriParcelOptions.length;
    if(bIsChangeTime && farmLength == 0) //when change, do it for firstTime
    {
      this.serviceAgrifarm.getFarms(farmLength).subscribe(data => { 
        listServer = data; 
        if(listServer.length == 0 ) { this.hasMoreAgriFarm = false } //disable butons if all data is already downloaded
        else { listServer.forEach(farm => { this.agriFarmOptions.push({ object: farm, status: false }) }) };   
      });    
    }  
    else if(!bIsChangeTime) { //when change, do it for firstTime
      this.serviceAgrifarm.getFarms(farmLength).subscribe(data => { 
        listServer = data; 
        if(listServer.length == 0 ) { this.hasMoreAgriFarm = false } //disable butons if all data is already downloaded
        else { listServer.forEach(farm => { this.agriFarmOptions.push({ object: farm, status: false }) }) };   
      }); 
    }
  }

  //load objects and build the list
  entitiesTypeChange(): any {
    switch(this.selectedEntitiesType){
      case "Person":
        this.buildPersonList(true); 
        break;
      case "Truck":
        this.buildTruckList(true);
        break;
      case "AgriFarm":
        this.buildAgriFarmList(true);
        break;
      case "AgriParcel":
        this.buildAgriParcelList(true);
        break;
    }
  }

  //load more objects to show in selector list
  LoadMoreObjectList(strType: string): void {
    switch(strType){
      case 'Person':
        this.buildPersonList(false); 
        break;
      case 'Truck':
        this.buildTruckList(false);
        break;
      case 'AgriFarm':
        this.buildAgriFarmList(false);
        break;
      case 'AgriParcel':
        this.buildAgriParcelList(false);
        break;
    }
  }

  //disable object list
  saveObjectList(strType: string): void {
    switch(strType){
      case 'Person':
        this.isValidPersonList = true;
        break;
      case 'Truck':
        this.isValidTruckList = true;
        break;
      case 'AgriFarm':
        this.isValidAgriFarmList = true;
        break;
      case 'AgriParcel':
        this.isValidAgriParcelList = true;
        break;
    }    
  }

  //enable object list to customer select
  updateObjectList(strType: string): void {
    switch(strType){
      case 'Person':
        this.isValidPersonList = false;
        break;
      case 'Truck':
        this.isValidTruckList = false;
        break;
      case 'AgriFarm':
        this.isValidAgriFarmList = false;
        break;
      case 'AgriParcel':
        this.isValidAgriParcelList = false;
        break;
    }
  }

  //build Measurements query to insert on the payload
  buildQueryMeasurements(measurementRule: any): any {  
    console.log(measurementRule)
    this.conditionMeasuremenst = { attrs: [], expression: {q: ""} }; //always clear the object
    var measurements = measurementRule as MeasurementsStruct[];
    var query = "";

    measurements.forEach(me => {
      if(!this.conditionMeasuremenst.attrs.includes(me.field)){
        this.conditionMeasuremenst.attrs.push(me.field);
      }

      query += String().concat(me.field, me.operation, me.value, ";");
    })

    this.conditionMeasuremenst.expression.q = query.slice(0, this.conditionMeasuremenst.expression.q.length-1); //remove last ';' from string
  }

  //build Measurements query to insert on the payload
  buildQueryGeofence(geofenceRule: any): void {
    this.conditionGeofence = { //always clear the object
      attrs: [""], 
      expression: { 
        georel: "", 
        geometry: "", 
        coords: ""}
    }; 

    this.conditionGeofence = {
      attrs: ["location"], 
      expression: {
        georel: geofenceRule.georel, 
        geometry: geofenceRule.geometry, 
        coords: geofenceRule.coords
      }
    }
  }

  //check if one of lists' object is OK or if the customer selected the patternType (All)
  checkAllValidations(strMessage: string): boolean {
    return (
      this.isValidPersonList //list of Persons selected
      || this.isValidTruckList //list of Trucks selected
      || this.isValidAgriFarmList //list of Farms selected
      || this.isValidAgriParcelList //list of Parcels selected
      || this.selectedPattern == "All") //Pattern selected ("urn:ngsi-ld:<Type>>:*")
      && this.isObjectToSendValid; //Object to send is valid
  }

  //format the object JSON to send to server
  formatObject(pageForm: any): any {
    return { 
      description: pageForm.description,
      subject: {
        entities: this.getEntitiesObject(pageForm),
        condition: this.getCondition()          
      },
      notification: {
        httpCustom: { 
          url: environment.apiPython + "/notifications",
          method: "POST",
          payload: this.getPayloadstring(pageForm.message)
        },
        attrs: [],
        attrsFormat: "keyValues"
      },
      expires: pageForm.expired ? new Date(pageForm.expired).toISOString() : "",
      throttling: 30
    }
  }

  //save the new SmartRule
  saveRule(): void {
    var strMessage: string = "";
    const rule = this.formatObject(this.pageForm.value);
    if(this.checkAllValidations(strMessage)) {          
      const _this = this;
      this.spinner.show();
      this.serviceSmartRule.saveContainer(rule).subscribe({
        next() {
        },
        complete() {
          _this.spinner.hide();
          _this.route.navigateByUrl('/');
        },
      });
    }
    else {      
      console.log(rule);
      this.showMessageDialog(strMessage, "Warning");
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

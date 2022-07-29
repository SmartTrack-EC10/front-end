import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SmartRuleApiService } from 'src/app/core/services/smart-rules-service/smart-rule-api.service';
import { environment } from 'src/environments/environment';
import { DialogComponent, DialogData } from 'src/app/pages/dialog/dialog.component'

export interface TruckList { truck: any, status: boolean }
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

  entitiesTypes: string[] = ['Person', 'Truck', 'AgriFarm', 'AgriParcel'];
  entitiesIsPattern: string[] = ['All', 'Devices'];
  ruleType: string[] = ['Measurements', 'Geofence'];

  selectedPattern: string = "";
  selectedRuleType: string = "";
  selectedEntitiesType: string = "";

   //enable or disable buttons
  isValidPersonList: boolean = false;
  isValidTruckList: boolean = false;
  isValidAgriFarmList: boolean = false;
  isValidAgriParcelList: boolean = false;

  isObjectToSendValid: boolean = true; //Is valid object to send?

  personList: any[] = [];
  truckList: any[] = [{id: "urn:ngsi-ld:Truck:truck001", alias: "truck001"}, {id: "urn:ngsi-ld:Truck:truck002", alias: "truck002"}, {id: "urn:ngsi-ld:Truck:truck003", alias: "truck003"}];
  agriFarmList: any[] = [];
  agriParcelList: any[] = [];

  conditionMeasuremenst: MeasurementsCondition = {attrs: [], expression: {q: ""}};
  conditionGeofence: GeofenceCondition = {attrs: [], expression: { georel: "", geometry: "", coords: "" }};

  personOptions: any[] = [];
  truckOptions: TruckList[] = [];
  agriFarmOptions: any[] = [];
  agriParcelOptions: any[] = [];

  constructor(private fb: FormBuilder,
    private serviceSmartRule: SmartRuleApiService,
    private servicePerson: SmartRuleApiService,
    private serviceTruck: SmartRuleApiService,
    private serviceAgrifarm: SmartRuleApiService,
    private serviceAgriParcel: SmartRuleApiService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private dialogMap: MatDialog) {

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
      for(let truck of this.truckList){
        this.truckOptions.push(
          {
            truck: truck,
            status: false
          }
        )
      }
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
            id: "urn:ngsi-ld:" + pageForm.entitiesType + ":" + truck.truck.id,
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
    var strDevice = "{ \"message\": \"" + strMessage + "\"," + //check here to set the message to send by notifications
      "\"id\":\"${id}\",\"type\":\"${type}\"," +
      "\"TimeInstant\":\"${TimeInstant}\",\"alias\":\"${alias}\",\"battery\":\"${alias}\"," +
      "\"dataTruck\":${dataTruck},\"fuel\": \"${fuel}\",\"greenLight_info\": \"${greenLight_info}\"," +
      "\"greenLight_status\":\"${greenLight_status}\",\"lastMaintenance\": ${lastMaintenance}," +
      "\"location\":\"${location}\",\"motionDetection\":\"${motionDetection}\"," +
      "\"motorTemperature\":\"${motorTemperature}\",\"ownedBy\":\"${ownedBy}\"," +
      "\"redLight_info\":\"${redLight_info}\",\"redLight_status\":\"${redLight_status}\"," +
      "\"relatedFarm\":\"${relatedFarm}\",\"relatedParcel\":\"${relatedParcel}\"," +
      "\"workedHours\":\"${workedHours}\",\"yellowLight_info\":\"${yellowLight_info}\"," +
      "\"yellowLight_status\":\"${yellowLight_status}\"}";

    return strDevice;
  }

  //condition to gerenerate notifications
  getCondition(): any {
    var condition = {}
    console.log(this.conditionMeasuremenst)
    if(this.selectedRuleType == "Measurements"){
      condition = this.conditionMeasuremenst;
    }
    else if(this.selectedRuleType == "Geofence"){
      condition = this.conditionGeofence;
    }
    else{
      this.isObjectToSendValid = false;
    }

    return condition;
  }

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

  LoadMoreDevicesList(): void {
  }

  saveDevicesList(): void {
    this.isValidTruckList = true;
  }

  updateDevicesList(): void {
    this.isValidTruckList = false; 
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
    console.log(this.conditionMeasuremenst)
  }

  //build Measurements query to insert on the payload
  buildQueryGeofence(geofenceRule: any): void {
    console.log(geofenceRule);
    this.conditionGeofence = { attrs: ["location"], expression: { georel: "", geometry: "", coords: ""} }; //always clear the object

    this.conditionGeofence = {
      attrs: ["location"], 
      expression: {
        georel: geofenceRule.georel, 
        geometry: geofenceRule.geometry, 
        coords: geofenceRule.coords
      }
    }
  }

  checkAllValidations(): boolean {
    return (this.isValidPersonList || this.isValidTruckList ||
      this.isValidAgriFarmList || this.isValidAgriParcelList ) && this.isObjectToSendValid;
  }

  saveRule(): void {
    const rule = this.formatObject(this.pageForm.value);
    if(this.checkAllValidations()) {          
      console.log(rule);
    }
    else {
      console.log(rule);
      this.showMessageDialog("saveRule()", "Information");
    }

    // const _this = this;
    // this.spinner.show();
    // this.service.saveContainer(rule).subscribe({
    //   next() {
    //   },
    //   complete() {
    //     _this.spinner.hide();
    //     _this.route.navigateByUrl('/');
    //   },
    // });
  }

  showMessageDialog(strMessage: string, strType: string): void {
    var dataDialog: DialogData = {message: strMessage, type: strType };
    var config = {
      data: dataDialog,
      width: '250px',
      enterAnimationDuration: "500ms",
      exitAnimationDuration: "1000ms"
    }
    
    this.dialogMap.open(DialogComponent, config)       
  }
}

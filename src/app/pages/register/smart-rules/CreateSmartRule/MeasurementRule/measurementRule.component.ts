import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent, DialogData } from 'src/app/pages/dialog/dialog.component'
import { MeasurementsStruct } from "../newSmartRules.component"

export interface Attributes { value: string, label: string }
export interface Operations { value: string }

@Component({
  selector: 'measurement-rule',
  templateUrl: './measurementRule.component.html',
  styleUrls: ['./measurementRule.component.scss']
})

export class MeasurementRuleComponent implements OnInit {

  @Input() selectedRuleType: String = "";
  @Output() meStructSend = new EventEmitter<MeasurementsStruct[]>();

  measurementsStructList: MeasurementsStruct[] = new Array<MeasurementsStruct>();

  isValidMeasurement = false;

  attributes: Attributes[] = [{ value: "motorTemperature", label: "Motor Temperature" }, 
    { value: "fuel", label: "Fuel" }, 
    { value: "motionDetected", label: "Motion Detected" }, 
    { value: "workedHours", label: "Worked Hours" }, 
    { value: "baterry", label: "Battery" },
    { value: "relatedParcel", label: "Parcel" },
    { value: "relatedFarm", label: "Farm" }]

  operations: Operations[] = [{ value: "<"  }, { value: ">"  }, { value: "<=" }, { value: ">=" }, { value: "==" }, { value: "!=" }]
  operationsId: Operations[] = [{ value: "==" }, { value: "!=" }] 
  
  constructor(private dialogMap: MatDialog){}

  ngOnInit(): void {
  }

  //send the rules to parent's page
  onSave(): void {  
    if(this.measurementsStructList.length == 0){
      this.showMessageDialog("Please, insert one or more values in Rules!", "Warning");
    }
    else if(this.checkMeasurementsRules()){
      this.showMessageDialog("Please, insert all values in Rules!", "Warning");
    }
    else{
      this.isValidMeasurement = true;
      this.meStructSend.emit(this.measurementsStructList);
    }
  }  

  //check all rules
  checkMeasurementsRules(): boolean {
    var bValid = true;

    this.measurementsStructList.forEach(me => {
      if(me.field || me.operation || me.value){
        bValid = false;        
        return;
      }
    })

    return bValid;
  }

  //enable the table to insert new Rules
  onUpdate(): void {  
    this.isValidMeasurement = false;
  }

  //Add new row to table Rules
  addMeasurement(): void {
    var list = this.measurementsStructList;
    var newMeasurementsStruct: MeasurementsStruct = { field: "", operation: "", value: "" };

    list.push(newMeasurementsStruct);
    this.measurementsStructList = list;
  }

  //remove a row from table/list Rules
  removeMeasurement(index: number): void {
    this.measurementsStructList.splice(index, 1);
  }

  //show messages of error
  showMessageDialog(strMessage: string, strType: string): void {
    var dataDialog: DialogData = {message: strMessage, type: strType };
    var config = {
      data: dataDialog,
      width: '250px'
    }

    this.dialogMap.open(DialogComponent, config);       
  }
}

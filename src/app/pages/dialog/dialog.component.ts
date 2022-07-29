import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faCircleExclamation, faCircleQuestion, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export interface DialogData {
  message: string;
  type: string;
}

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})

export class DialogComponent {
  faCircleExclamation = faCircleExclamation;
  faCircleQuestion = faCircleQuestion;
  faCircleXmark = faCircleXmark;

  selectedType: string = "";
  selectedMessage: string = "";

  dialogType: string[] = ["Information", "Warning", "Error"];

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {  

    this.dialogRef.updateSize("250px", "400px");
      
    this.showMessageDialog(data.message, data.type);
  }

  onClose() {
    this.dialogRef.close();
  }

  showMessageDialog(strMessage: string, strType: string): void {
    if(!this.dialogType.includes(strType)){
      this.selectedType = "Error";
      this.selectedMessage = "Error's type not found!";
    }   
    else{
      switch(strType){
        case "Information":
          this.selectedType = "Information";
          this.selectedMessage = strMessage;
          break;
        case "Warning":
          this.selectedType = "Warning";
          this.selectedMessage = strMessage;
          break;
        case "Error":
        default:
          this.selectedType = "Error";
          this.selectedMessage = strMessage;
      }
    }
  }
}

import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { NotificationApiService } from 'src/app/core/services/notification-service/notification-api.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  @Input() id = '';

  value: number = 0;
  units: string = 'alarmes';

  ELEMENT_DATA: any[] = [];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = this.ELEMENT_DATA;
  constructor(
    public dialog: MatDialog,
    private service: NotificationApiService,
    private spinner: NgxSpinnerService
  ) {}

  openDialog(element: any) {
    const dialogRef = this.dialog.open(DataDialog, {
      data: {
        name: element.name,
        weight: element.weight,
        symbol: element.symbol,
      },
    });
  }
  ngOnInit(): void {
    const _this = this;
    this.spinner.show();
    this.service
      .getNotification(this.id)
      .pipe(finalize(() =>  this.spinner.hide()))
      .subscribe((res) => {
        this.dataSource = res;
        _this.value = res.length;
        console.log(this.dataSource)
      });
  }
}

@Component({
  selector: 'data-dialog',
  templateUrl: 'data.dialog.html',
  styleUrls: ['./notifications.component.scss'],
})
export class DataDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

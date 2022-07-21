import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/shared/models/user';
import { UserApiService } from 'src/app/core/services/user-service/user-api.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  pageForm: FormGroup;
  isFetching: boolean = false;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private service: UserApiService,
    private route: Router,
    private spinner: NgxSpinnerService
  ) {
    this.pageForm = this.fb.group({
      name: [''],
      field: [''],
      CPF: [''],
      RFID: [''],
      lgpd: [''],
    });
  }

  ngOnInit(): void {}

  openDialog() {
    const dialogRef = this.dialog.open(DialogLGPDDialog);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  saveUser() {
    const container = this.pageForm.value as User;
    const _this = this;
    this.spinner.show();
    this.service.saveContainer(container).subscribe({
      next() {
        console.log(_this.isFetching)
      },
      complete() {
        _this.spinner.hide();
        _this.route.navigateByUrl('/');
      },
    });
  }
}

@Component({
  selector: 'dialog-lgpd-dialog',
  templateUrl: 'dialog.lgpd.dialog.html',
})
export class DialogLGPDDialog {}

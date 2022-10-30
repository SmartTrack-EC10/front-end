import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user';
import { UserApiService } from 'src/app/core/services/user-service/user-api.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as uuid from 'uuid';

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
      id: ['urn:ngsi-ld:Person:' + uuid.v4()],
      type: ['Person'],
      name: ['', [
        Validators.required,
        Validators.minLength(4),
      ]],
      field: [''],
      cpf: ['', [
        Validators.required,
        Validators.minLength(4),
      ]],
      rfid: ['', [
        Validators.required,
      ]],
      lgpd: ['', [
        Validators.required,
      ]],
    });
  }

  ngOnInit(): void { }

  openDialog() {
    const dialogRef = this.dialog.open(DialogLGPDDialog);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  formatObject(user: any) {
    return {
      id: user.id,
      type: user.type,
      name: { type: "Text", value: user.name },
      field: { type: "Text", value: user.field },
      rfid: { type: "Text", value: user.rfid },
      cpf: { type: "Text", value: user.cpf }
    }
  }

  saveUser() {
    if (this.pageForm.valid) {
      const container = this.formatObject(this.pageForm.value);
      const _this = this;
      this.spinner.show();
      this.service.saveContainer(container).subscribe({
        next() {
          console.log(_this.isFetching);
        },
        complete() {
          _this.spinner.hide();
          _this.route.navigateByUrl('/');
        },
      });
    }
  }
}

@Component({
  selector: 'dialog-lgpd-dialog',
  templateUrl: 'dialog.lgpd.dialog.html',
})
export class DialogLGPDDialog { }

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { SmartRuleApiService } from 'src/app/core/services/smart-rules-service/smart-rule-api.service';

@Component({
  selector: 'all-smart-rules',
  templateUrl: './allSmartRules.component.html',
  styleUrls: ['./allSmartRules.component.scss'],
})

export class AllSmartRulesComponent implements OnInit {
  displayedColumns: string[] = ['description', 'status', 'expires', 'options'];
  dataSource: any[] = [];
  smartRulesList: any[] = [];
  isValidSRList: boolean = true;

  @ViewChild(MatTable) table!: MatTable<any>;
  constructor(
    private fb: FormBuilder,
    private service: SmartRuleApiService,
    private route: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getSubiscriptionList(0);
  }

  //get a list of SmartRules
  getSubiscriptionList(offset: number) {
    this.spinner.show();
    this.service
      .getSmartRules(offset)
      .pipe(finalize(() =>  this.spinner.hide()))
      .subscribe((res) => {
        this.isValidSRList = res.length > 0
        res.forEach((item: any) => {
          this.dataSource.push(item);
        });
        this.table.renderRows();
      });


      
  }

  //load more SmartRules from Server
  loadMoreSubscriptions() {
    var smartRules = this.dataSource.length;
    this.getSubiscriptionList(smartRules);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SmartRuleApiService } from 'src/app/core/services/smart-rules-service/smart-rule-api.service';

@Component({
  selector: 'all-smart-rules',
  templateUrl: './allSmartRules.component.html',
  styleUrls: ['./allSmartRules.component.scss']
})

export class AllSmartRulesComponent implements OnInit  {
  displayedColumns: string[] = ["description", "status", "expired"]
  smartRulesList: any[] = []
  isValidSRList: boolean = true;

  constructor(
    private fb: FormBuilder,
    private service: SmartRuleApiService,
    private route: Router,
    private spinner: NgxSpinnerService) 
  {
    
  }

  ngOnInit(): void {
    this.getSubiscriptionList(0);
  }

  //get a list of SmartRules
  getSubiscriptionList(offset: number) {
    var listServer: any[] = [];
    this.service.getSmartRules(offset).subscribe(data => {
        listServer = data;
        if(listServer.length == 0 ) { this.isValidSRList = false } //disable butons if all data is already downloaded
        else { listServer.forEach(smartRule => { this.smartRulesList.push(smartRule) }); }
    });
  }

  //load more SmartRules from Server
  loadMoreSubscriptions() {
    var smartRules = this.smartRulesList.length;
    this.getSubiscriptionList(smartRules);
  }
}

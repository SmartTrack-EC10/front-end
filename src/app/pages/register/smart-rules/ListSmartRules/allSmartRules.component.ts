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

  constructor(
    private fb: FormBuilder,
    private service: SmartRuleApiService,
    private route: Router,
    private spinner: NgxSpinnerService) 
  {
    
  }

  ngOnInit(): void {
    this.getSubiscriptionList();
  }

  async getSubiscriptionList() {
    this.service.getSmartRules()
      .subscribe(data => {
        this.smartRulesList = data;
      });
  }
}

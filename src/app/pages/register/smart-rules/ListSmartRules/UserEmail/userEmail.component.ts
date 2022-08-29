import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { SmartRuleApiService } from 'src/app/core/services/smart-rules-service/smart-rule-api.service';

@Component({
  selector: 'user-email',
  templateUrl: './userEmail.component.html',
  styleUrls: ['./userEmail.component.scss'],
})

export class UserEmailComponent implements OnInit {
  @Input() selectedSmartRule: any = {};

  constructor(
    private fb: FormBuilder,
    private service: SmartRuleApiService,
    private route: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {    
  }

  
}

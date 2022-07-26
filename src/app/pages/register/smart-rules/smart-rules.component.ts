import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SmartRuleApiService } from 'src/app/core/services/smart-rules-service/smart-rule-api.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-smart-rules',
  templateUrl: './smart-rules.component.html',
  styleUrls: ['./smart-rules.component.scss']
})
export class SmartRulesComponent implements OnInit {
  pageForm: FormGroup;

  constructor(private fb: FormBuilder,
    private service: SmartRuleApiService,
    private route: Router,
    private spinner: NgxSpinnerService) {
    this.pageForm = this.fb.group({
      description: [''],
      value: [''],
      type: [''],
    });
  }

  ngOnInit(): void {
  }

  formatObject(rule: any) {
    return {
      description: rule.description,
      id: 'urn:ngsi-ld:Subscription:' + uuid.v4(),
      subject: {
        entities: [
          {
            idPattern: "urn:ngsi-ld:Truck:2feefcf6-b7c8-470f-a628-d92300ef64c4",
            type: "Truck"
          }
        ],
        condition: {
          attrs: ["motorTemperature"],
          expression: { q: "motorTemperature" + rule.type + rule.value }
        }
      },
      notification: {
        http: { "url": "http://52.55.93.53:1880/notifications" },
        attrs: [],
        attrsFormat: "keyValues"
      },
      expires: "",
      throttling: 30
    }
  }
  saveRule() {
    console.log(this.formatObject(this.pageForm.value))

    const rule = this.formatObject(this.pageForm.value);
    const _this = this;
    this.spinner.show();
    this.service.saveContainer(rule).subscribe({
      next() {
      },
      complete() {
        _this.spinner.hide();
        _this.route.navigateByUrl('/');
      },
    });
  }
}

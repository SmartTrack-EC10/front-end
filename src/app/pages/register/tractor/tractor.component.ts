import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as uuid from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { TruckApiService } from 'src/app/core/services/truck-service/truck-api.service';

@Component({
  selector: 'app-tractor',
  templateUrl: './tractor.component.html',
  styleUrls: ['./tractor.component.scss'],
})
export class TractorComponent implements OnInit {
  pageForm: FormGroup;
  isFetching = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private service: TruckApiService,
    private route: Router
  ) {
    this.pageForm = this.fb.group({
      alias: ['', [
        Validators.required,
      ]],
      model: ['', [
        Validators.required,
      ]],
      manufacturer: ['', [
        Validators.required,
      ]],
      year: ['', [
        Validators.required,
      ]],
    });
  }

  ngOnInit(): void {

    this.service.getTrucks(0).subscribe(data => {
      console.log(data);
    })
  }

  formatObject(tractor: any) {
    const id = uuid.v4();
    const entityName = 'urn:ngsi-ld:Truck:' + id;
    return {
      devices: [
        {
          device_id: id,
          entity_name: entityName,
          entity_type: 'Truck',
          protocol: 'PDI-IoTA-UltraLight',
          transport: 'MQTT',
          timezone: 'America/Sao_Paulo',
          attributes: [
            {
              object_id: 'loc',
              name: 'location',
              type: 'geo:point',
            },
            {
              object_id: 'mt',
              name: 'motorTemperature',
              type: 'Number',
            },
            {
              object_id: 'fu',
              name: 'fuel',
              type: 'Number',
            },
            {
              object_id: 'md',
              name: 'motionDetection',
              type: 'Number',
            },
            {
              object_id: 'wh',
              name: 'workedHours',
              type: 'Number',
            },
            {
              object_id: 'bt',
              name: 'battery',
              type: 'Number',
            },
          ],
          commands: [
            {
              name: 'redLight',
              type: 'command',
            },
            {
              name: 'yellowLight',
              type: 'command',
            },
            {
              name: 'greenLight',
              type: 'command',
            },
          ],
          static_attributes: [
            {
              name: 'alias',
              type: 'Text',
              value: tractor.alias,
            },
            {
              name: 'dataTruck',
              type: 'Property',
              value: {
                manufacturer: tractor.manufacturer,
                model: tractor.model,
                year: tractor.year,
              },
            },
            {
              name: 'lastMaintenance',
              type: 'Property',
              value: {
                date: '2022-06-29T20:47:08.000-03:00',
                type: '10 horas',
                operator: {
                  id: 'urn:ngsi-ld:Person:a286acf5-a1d5-4e42-9e50-8187d0d9c5de',
                  name: 'José',
                  field: 'Mecânico',
                  rfid: 'ABCDEF01',
                },
                description: 'Abastecimento de água',
              },
            },
            {
              name: 'ownedBy',
              type: 'Relationship',
              value: 'urn:ngsi-ld:Person:{{uuid}}',
            },
            {
              name: 'relatedFarm',
              type: 'Relationship',
              value: 'urn:ngsi-ld:AgriFarm:{{uuid}}',
            },
            {
              name: 'relatedParcel',
              type: 'Relationship',
              value: 'urn:ngsi-ld:AgriParcel:{{uuid}}',
            },
          ],
        },
      ],
    };
  }
  saveTruck() {
    const truck = this.formatObject(this.pageForm.value);
    const _this = this;
    this.spinner.show();
    this.service.saveTruck(truck).subscribe({
      next() {
        console.log(_this.isFetching);
      },
      error(e) {
        alert(e.message);
        _this.spinner.hide();
      },
      complete() {
        _this.spinner.hide();
        _this.route.navigateByUrl('/');
      },
    });
  }
}

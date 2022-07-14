import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tractor',
  templateUrl: './tractor.component.html',
  styleUrls: ['./tractor.component.scss'],
})
export class TractorComponent implements OnInit {
  pageForm: FormGroup;
  isFetching = false;

  constructor(private fb: FormBuilder) {
    this.pageForm = this.fb.group({
      plate: [''],
      year: [''],
    });
  }

  ngOnInit(): void {}
}

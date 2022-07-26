import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.scss'],
})
export class PlotComponent implements OnInit {
  pageForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.pageForm = this.fb.group({
      Alias : [''],
      Status  : [''],
      Description  : [''],
    });
  }

  ngOnInit(): void {}
}

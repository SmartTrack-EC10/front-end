import { NgModule } from "@angular/core";

import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { NewSmartRulesComponent } from './CreateSmartRule/newSmartRules.component'
import { AllSmartRulesComponent } from './ListSmartRules/allSmartRules.component'
import { SmartRulesComponent } from './smart-rules.component'
import { MapRuleComponent } from './CreateSmartRule/MapRule/mapRule.component'
import { MeasurementRuleComponent } from './CreateSmartRule/MeasurementRule/measurementRule.component'
import { DialogComponent } from '../../dialog/dialog.component'
import { DialogMapPointsComponent } from './CreateSmartRule/MapRule/dialogMapPoints/dialogMapPoints.component'

@NgModule({
    imports: [
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        NgxSpinnerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatCheckboxModule,
        MatTableModule,
        MatExpansionModule,
        MatGridListModule,

        FontAwesomeModule,

        FormsModule, ReactiveFormsModule,
        BrowserModule
    ],
    declarations: [NewSmartRulesComponent, 
        AllSmartRulesComponent, 
        SmartRulesComponent, 
        MapRuleComponent,
        MeasurementRuleComponent, 
        DialogComponent,
        DialogMapPointsComponent]
})

export class SmartRules {}
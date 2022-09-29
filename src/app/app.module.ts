import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FarmComponent } from './pages/register/farm/farm.component';
import {
  DialogLGPDDialog,
  UserComponent,
} from './pages/register/user/user.component';
import { TractorComponent } from './pages/register/tractor/tractor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { PlotComponent } from './pages/register/plot/plot.component';

import { SmartRules } from './pages/register/smart-rules/smart-rules.module'
import { AboutComponent } from './pages/about/about.component';
import { HelpComponent } from './pages/help/help.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MaintenanceCardComponent } from './components/maintenance-card/maintenance-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FarmComponent,
    UserComponent,
    TractorComponent,
    DialogLGPDDialog,
    NotificationsComponent,
    PlotComponent,
    AboutComponent,
    HelpComponent,
    DashboardComponent,
    MaintenanceCardComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    HttpClientModule,
    NgxSpinnerModule,
    MatProgressSpinnerModule,
    NgxChartsModule,
    MatTableModule,
    MatSelectModule,
    SmartRules
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}

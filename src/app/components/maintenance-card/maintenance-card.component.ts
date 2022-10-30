import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface Notifications {
  name: string;
  status: string;
  date: Date;
}


/** Constants used to fill up our data base. */
const STATUS: string[] = [
  'Atrasada',
  'Notificada',
  'Realizada',
];
const NAMES: string[] = [
  'Troca de óleo',
  'Troca de filtro',
  'Calibração dos pneus',
];

@Component({
  selector: 'app-maintenance-card',
  templateUrl: './maintenance-card.component.html',
  styleUrls: ['./maintenance-card.component.scss']
})
export class MaintenanceCardComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'status', 'date', 'action'];
  dataSource: MatTableDataSource<Notifications>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    // Create 100 users
    const notif = Array.from({ length: 100 }, (_, k) => this.createNotification());

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(notif);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Builds and returns a new User. */
  createNotification(): Notifications {

    return {
      name: NAMES[Math.round(Math.random() * (NAMES.length - 1))],
      status: STATUS[Math.round(Math.random() * (NAMES.length - 1))],
      date: new Date(),
    };
  }
}

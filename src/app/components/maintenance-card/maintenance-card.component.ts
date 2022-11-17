import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { interval, Subscription } from 'rxjs';
import { NotificationApiService } from 'src/app/core/services/notification-service/notification-api.service';

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
  @Input() id = 'urn:ngsi-ld:Truck:2feefcf6-b7c8-470f-a628-d92300ef64c4';
  displayedColumns: string[] = ['message', 'status', 'datetime', 'action'];
  dataSource: MatTableDataSource<Notifications>;
  subscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: NotificationApiService,) {
  }
  ngOnInit(): void {
    const source = interval(120000)
    const _this = this;
    this.getNotf()
    this.subscription = source.subscribe(() => {
      this.getNotf()
    });
    
  }

  getNotf(){
    this.service
    .getNotification(this.id)
    .subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
    });
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

}

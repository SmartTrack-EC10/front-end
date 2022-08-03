import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showCollapsible:boolean = false;

  title:string = '';

  toogleCollapsible(){
    this.showCollapsible = !this.showCollapsible;
  }
}

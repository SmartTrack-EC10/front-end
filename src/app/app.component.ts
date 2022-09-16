import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showCollapsible:boolean = false;

  constructor(private router: Router){

  }

  activatedRoute = '';

  activateRoute(activatedRoute: string) {
    this.activatedRoute = activatedRoute;
  }

  get headerTitle() {
    this.activatedRoute = this.router.url
    console.log(this.activatedRoute)
      if (this.activatedRoute.includes('cadastrar')) {
        return 'Cadastro';
      } else if (this.activatedRoute.includes('notificacoes')) {
        return 'Notificações';
      } else if (this.activatedRoute.includes('aboutus')) {
        return 'Sobre';
      } else if (this.activatedRoute.includes('contactus')) {
        return 'Suporte';
      } else {
        return 'Home';
      }
    }

  toogleCollapsible(){
    this.showCollapsible = !this.showCollapsible;
  }
}

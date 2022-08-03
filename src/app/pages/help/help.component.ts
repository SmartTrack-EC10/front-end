import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

//import 'c:/src/smart-track/src/assets/smtp.js';
declare let Email: any;

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  pageForm: FormGroup;
  constructor(private fb: FormBuilder, private route: Router) {
    this.pageForm = this.fb.group({
      name: [''],
      subject: [''],
      email: ['', Validators.email],
      message: [''],
    });
  }

  ngOnInit(): void {}
  sendEmail() {
    const _this = this;
    Email.send({
      Host: 'smtp.elasticemail.com',
      Username: 'smarttrack.ftt@gmail.com',
      Password: '6478D3E6CF3205CE56712DC2911C755A7631',
      To: 'smarttrack.ftt@gmail.com',
      From: 'smarttrack.ftt@gmail.com',
      Subject: this.pageForm.value.subject,
      Body: `
  <i>Email enviado do contato</i> <br/> 
  <b>Nome: </b>${this.pageForm.value.name} <br />
  <b>Email: </b>${this.pageForm.value.email}<br /> 
  <b>Asunto: </b>${this.pageForm.value.subject}<br /> 
  <b>Mensagem:</b> <br /> ${this.pageForm.value.message} <br><br> <b>~Fim da Mensagem.~</b> `,
    }).then((message: any) => {
      alert(message);
      _this.route.navigateByUrl('/');
    });
  }
}

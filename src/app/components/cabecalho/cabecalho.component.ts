import { Component } from '@angular/core';
import {Dialog} from '@angular/cdk/dialog';
import {ModalLoginComponent} from '../modal-login/modal-login.component';
import {RouterLink, RouterModule} from '@angular/router';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cabecalho',
  imports: [
    RouterModule
  ],
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.scss'
})
export class CabecalhoComponent {
  constructor(
    private dialog: Dialog,
    private router: Router
  ) {}
  openModalLogin(){
    this.dialog.open(ModalLoginComponent, {})
  }
}

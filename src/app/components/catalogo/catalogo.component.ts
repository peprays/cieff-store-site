import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {ModalComponent} from '../modal/modal.component';


@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CatalogoComponent {
  constructor(private dialog: Dialog) {}
  openModal(titulo: string, imagem: string, descricao: string, tabela: string, link: string) {
    this.dialog.open(ModalComponent, {
      data: {
        titulo,
        imagem,
        descricao,
        tabela,
        link
      }
    });
  }
}

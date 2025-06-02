import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CatalogoComponent {
  // O construtor injeta o serviço Dialog, que permite abrir modais na tela
  constructor(private dialog: Dialog) {}

  // Função chamada ao clicar em um produto do catálogo
  // Recebe todos os dados necessários do produto como parâmetros
  openModal(
    id: number,            // ID do produto
    titulo: string,        // Nome do produto
    imagem: string,        // Caminho da imagem do produto
    descricao: string,     // Descrição detalhada do produto
    tabela: string,        // Link para tabela de tamanhos
    link: string           // Link para página do carrinho ou compra
  ) {
    // Abre o ModalComponent como um modal, passando os dados do produto via 'data'
    this.dialog.open(ModalComponent, {
      data: {
        id,         // ID do produto
        titulo,     // Título do produto
        imagem,     // Imagem do produto
        descricao,  // Descrição do produto
        tabela,     // Tabela de tamanhos
        link        // Link para compra/carrinho
      }
    });
  }
}
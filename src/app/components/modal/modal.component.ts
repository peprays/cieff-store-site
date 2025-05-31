import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CarrinhoService } from '../../services/carrinho.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  isClosing = false;
  tamanhoSelecionado: string = '';
  corSelecionada: string = '';

  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private dialogRef: DialogRef<ModalComponent>,
    private carrinhoService: CarrinhoService
  ) {
    // Verifica se os dados foram passados corretamente
    console.log('Dados recebidos no modal:', this.data);
  }

  selecionarTamanho(tamanho: string) {
    this.tamanhoSelecionado = tamanho;
  }

  selecionarCor(cor: string) {
    this.corSelecionada = cor;
  }

  adicionarAoCarrinho() {
    if (!this.tamanhoSelecionado) {
      alert('Por favor, selecione um tamanho!');
      return;
    }

    if (!this.data?.id) {
      alert('Erro ao adicionar ao carrinho: produto sem ID.');
      return;
    }

    this.carrinhoService.adicionarItemPorId(
      this.data.id,
      this.tamanhoSelecionado,
      this.corSelecionada
    );

    alert('Produto adicionado ao carrinho!');
    this.close();
  }

  close() {
    this.isClosing = true;
    setTimeout(() => {
      this.dialogRef.close();
    }, 300);
  }
}

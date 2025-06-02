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
  isClosing = false; // Controla se o modal está em processo de fechamento (para animação)
  tamanhoSelecionado: string = ''; // Armazena o tamanho selecionado pelo usuário
  corSelecionada: string = ''; // Armazena a cor selecionada pelo usuário

  constructor(
    @Inject(DIALOG_DATA) public data: any, // Dados recebidos ao abrir o modal (informações do produto)
    private dialogRef: DialogRef<ModalComponent>, // Referência ao modal para fechar programaticamente
    private carrinhoService: CarrinhoService // Serviço do carrinho para adicionar itens
  ) {
    // Exibe no console os dados recebidos para debug e conferência
    console.log('Dados recebidos no modal:', this.data);
  }

  // Função chamada ao selecionar um tamanho (ex: P, M, G)
  selecionarTamanho(tamanho: string) {
    this.tamanhoSelecionado = tamanho; // Atualiza o tamanho selecionado
  }

  // Função chamada ao selecionar uma cor (caso haja variação de cor)
  selecionarCor(cor: string) {
    this.corSelecionada = cor; // Atualiza a cor selecionada
  }

  // Função chamada ao clicar em "Adicionar ao carrinho"
  adicionarAoCarrinho() {
    // Verifica se o usuário selecionou um tamanho antes de adicionar ao carrinho
    if (!this.tamanhoSelecionado) {
      alert('Por favor, selecione um tamanho!');
      return;
    }

    // Verifica se o produto possui um ID válido
    if (!this.data?.id) {
      alert('Erro ao adicionar ao carrinho: produto sem ID.');
      return;
    }

    // Chama o serviço do carrinho para adicionar o item com as opções escolhidas
    this.carrinhoService.adicionarItemPorId(
      this.data.id,
      this.tamanhoSelecionado,
      this.corSelecionada
    );

    alert('Produto adicionado ao carrinho!'); // Mostra mensagem de sucesso
    this.close(); // Fecha o modal após adicionar ao carrinho
  }

  // Função para fechar o modal com animação
  close() {
    this.isClosing = true; // Ativa a animação de fechamento
    setTimeout(() => {
      this.dialogRef.close(); // Fecha o modal após 300ms (tempo da animação)
    }, 300);
  }
}
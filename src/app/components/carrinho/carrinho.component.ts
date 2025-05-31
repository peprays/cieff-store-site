import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {
  itens: ItemCarrinho[] = [];
  subTotal: number = 0;
  valorFinal: number = 0;

  constructor(private carrinhoService: CarrinhoService) {}

  ngOnInit() {
    // Inscreve-se para receber atualizações do carrinho
    this.carrinhoService.itens$.subscribe(itens => {
      this.itens = itens;
      this.calcularTotais();
    });

    // Carrega itens iniciais
    this.itens = this.carrinhoService.obterItens();
    this.calcularTotais();
  }

  aumentarQuantidade(item: ItemCarrinho) {
    this.carrinhoService.aumentarQuantidade(item.id, item.tamanho, item.cor);
  }

  diminuirQuantidade(item: ItemCarrinho) {
    this.carrinhoService.diminuirQuantidade(item.id, item.tamanho, item.cor);
  }

  removerItem(item: ItemCarrinho) {
    if (confirm('Tem certeza que deseja remover este item do carrinho?')) {
      this.carrinhoService.removerItem(item.id, item.tamanho, item.cor);
    }
  }

  calcularTotais() {
    this.subTotal = this.carrinhoService.obterSubTotal();
    this.valorFinal = this.subTotal; // Frete gratuito
  }

  finalizarCompra() {
    if (this.itens.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    // Aqui você pode implementar a lógica de finalização da compra
    alert('Redirecionando para finalização da compra...');
    // Exemplo: this.router.navigate(['/checkout']);
  }

  // Método para trackBy no ngFor (melhora performance)
  trackByItem(index: number, item: ItemCarrinho): string {
    return `${item.id}-${item.tamanho}-${item.cor}`;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
  categoria: string;
  tamanho?: string;
  cor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private itens: ItemCarrinho[] = [];
  private itensSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  itens$ = this.itensSubject.asObservable();

  private apiUrl = 'http://localhost:3000/produtos'; // ajuste para a URL correta da sua API

  constructor(private http: HttpClient) {
    this.carregarCarrinho();
  }

  // Método que busca o produto pelo id, adiciona tamanho e cor e adiciona ao carrinho
  adicionarItemPorId(id: number, tamanho?: string, cor?: string) {
    this.http.get<any>(`${this.apiUrl}/${id}`).subscribe(produto => {
      if (!produto) {
        console.error('Produto não encontrado no backend');
        return;
      }

      const item: ItemCarrinho = {
        id: produto.id,
        nome: produto.titulo,
        preco: produto.preco,
        imagem: produto.imagem,
        categoria: produto.categoria || 'Produto',
        quantidade: 1,
        tamanho,
        cor
      };

      const itemExistente = this.itens.find(i =>
        i.id === item.id &&
        i.tamanho === item.tamanho &&
        i.cor === item.cor
      );

      if (itemExistente) {
        itemExistente.quantidade += 1;
      } else {
        this.itens.push(item);
      }

      this.salvarCarrinho();
      this.itensSubject.next([...this.itens]);
    });
  }

  adicionarItem(item: Omit<ItemCarrinho, 'quantidade'>) {
    const itemExistente = this.itens.find(i =>
      i.id === item.id &&
      i.tamanho === item.tamanho &&
      i.cor === item.cor
    );

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      this.itens.push({ ...item, quantidade: 1 });
    }

    this.salvarCarrinho();
    this.itensSubject.next([...this.itens]);
  }

  removerItem(id: number, tamanho?: string, cor?: string) {
    this.itens = this.itens.filter(item =>
      !(item.id === id && item.tamanho === tamanho && item.cor === cor)
    );
    this.salvarCarrinho();
    this.itensSubject.next([...this.itens]);
  }

  aumentarQuantidade(id: number, tamanho?: string, cor?: string) {
    const item = this.itens.find(i =>
      i.id === id && i.tamanho === tamanho && i.cor === cor
    );
    if (item) {
      item.quantidade += 1;
      this.salvarCarrinho();
      this.itensSubject.next([...this.itens]);
    }
  }

  diminuirQuantidade(id: number, tamanho?: string, cor?: string) {
    const item = this.itens.find(i =>
      i.id === id && i.tamanho === tamanho && i.cor === cor
    );
    if (item && item.quantidade > 1) {
      item.quantidade -= 1;
      this.salvarCarrinho();
      this.itensSubject.next([...this.itens]);
    }
  }

  obterItens(): ItemCarrinho[] {
    return [...this.itens];
  }

  obterSubTotal(): number {
    return this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }

  obterQuantidadeTotal(): number {
    return this.itens.reduce((total, item) => total + item.quantidade, 0);
  }

  limparCarrinho() {
    this.itens = [];
    this.salvarCarrinho();
    this.itensSubject.next([]);
  }

  private salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(this.itens));
  }

  private carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      this.itens = JSON.parse(carrinhoSalvo);
      this.itensSubject.next([...this.itens]);
    }
  }
}

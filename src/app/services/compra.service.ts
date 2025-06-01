import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemCarrinho } from './carrinho.service';

export interface ItemCompra {
  produtoId: string;
  nomeProduto: string;
  categoria: string;
  preco: number;
  quantidade: number;
  tamanho?: string;
  cor?: string;
  total: number;
}

export interface Compra {
  id?: string;
  userId: string;
  nomeUsuario: string;
  dataCompra: string;
  itens: ItemCompra[];
  subtotal: number;
  valorTotal: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Salva uma nova compra
  salvarCompra(compra: Compra): Observable<Compra> {
    return this.http.post<Compra>(`${this.apiUrl}/compras`, compra);
  }

  // Obtém todas as compras de um usuário
  obterComprasUsuario(userId: string): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/compras?userId=${userId}`);
  }

  // Obtém todas as compras (para admin)
  obterTodasCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/compras`);
  }

  // Converte itens do carrinho para itens de compra
  converterItensCarrinho(itensCarrinho: ItemCarrinho[]): ItemCompra[] {
    return itensCarrinho.map(item => ({
      produtoId: String(item.id), // Garante conversão para string
      nomeProduto: item.nome,
      categoria: item.categoria,
      preco: item.preco,
      quantidade: item.quantidade,
      tamanho: item.tamanho,
      cor: item.cor,
      total: item.preco * item.quantidade
    }));
  }
}

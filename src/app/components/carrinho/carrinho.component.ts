import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho.service';
import { AuthService } from '../../services/auth.service';
import { ComprasService, Compra } from '../../services/compra.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {
  itens: ItemCarrinho[] = []; // Lista de itens no carrinho
  subTotal: number = 0; // Subtotal dos itens do carrinho
  valorFinal: number = 0; // Valor total (com frete, descontos, etc)
  processandoCompra: boolean = false; // Indica se está processando a finalização da compra

  constructor(
    private carrinhoService: CarrinhoService, // Injeta o serviço do carrinho
    private authService: AuthService, // Injeta o serviço de autenticação
    private comprasService: ComprasService, // Injeta o serviço de compras
    private router: Router // Injeta o serviço de navegação
  ) {}

  ngOnInit() {
    // Inscreve-se para receber atualizações do carrinho em tempo real
    this.carrinhoService.itens$.subscribe(itens => {
      this.itens = itens; // Atualiza a lista de itens do carrinho
      this.calcularTotais(); // Recalcula os totais sempre que o carrinho muda
    });

    // Carrega itens iniciais do carrinho ao abrir a página
    this.itens = this.carrinhoService.obterItens(); // Busca os itens salvos no serviço
    this.calcularTotais(); // Calcula os totais iniciais
  }

  // Aumenta a quantidade de um item no carrinho
  aumentarQuantidade(item: ItemCarrinho) {
    this.carrinhoService.aumentarQuantidade(item.id, item.tamanho, item.cor); // Chama o serviço para aumentar a quantidade
  }

  // Diminui a quantidade de um item no carrinho
  diminuirQuantidade(item: ItemCarrinho) {
    this.carrinhoService.diminuirQuantidade(item.id, item.tamanho, item.cor); // Chama o serviço para diminuir a quantidade
  }

  // Remove um item do carrinho após confirmação do usuário
  removerItem(item: ItemCarrinho) {
    if (confirm('Tem certeza que deseja remover este item do carrinho?')) { // Pede confirmação ao usuário
      this.carrinhoService.removerItem(item.id, item.tamanho, item.cor); // Remove o item do carrinho
    }
  }

  // Calcula o subtotal e valor final do carrinho
  calcularTotais() {
    this.subTotal = this.carrinhoService.obterSubTotal(); // Calcula o subtotal dos itens
    this.valorFinal = this.subTotal; // Frete gratuito, então valor final = subtotal
  }

  // Finaliza a compra e salva no backend
  finalizarCompra() {
    // Se o carrinho estiver vazio, não permite finalizar
    if (this.itens.length === 0) {
      alert('Seu carrinho está vazio!'); // Mostra alerta se não houver itens
      return; // Sai da função
    }

    // Verifica se o usuário está logado antes de finalizar a compra
    if (!this.authService.isLoggedIn()) {
      alert('Você precisa estar logado para finalizar a compra. Redirecionando para o login...'); // Alerta se não estiver logado
      this.router.navigate(['/home']); // Redireciona para a home (ou login)
      return; // Sai da função
    }

    this.processandoCompra = true; // Indica que está processando a compra
    const currentUser = this.authService.currentUser; // Pega o usuário logado

    // Se não conseguir obter o usuário logado, exibe erro
    if (!currentUser) {
      alert('Erro ao obter dados do usuário. Tente fazer login novamente.'); // Alerta de erro
      this.processandoCompra = false; // Para o processamento
      return; // Sai da função
    }

    // Busca os dados pessoais do usuário para pegar o nome
    this.authService.getCurrentUserData().subscribe({
      next: (dadosPessoais) => { // Se conseguir pegar os dados pessoais
        const nomeUsuario = dadosPessoais?.nome || currentUser.email; // Usa o nome, ou o e-mail se não houver nome

        // Cria o objeto da compra com todos os dados necessários
        const compra: Compra = {
          userId: currentUser.id, // ID do usuário
          nomeUsuario: nomeUsuario, // Nome do usuário
          dataCompra: new Date().toISOString(), // Data da compra em formato ISO
          itens: this.comprasService.converterItensCarrinho(this.itens), // Converte os itens do carrinho para o formato da compra
          subtotal: this.subTotal, // Subtotal da compra
          valorTotal: this.valorFinal, // Valor total da compra
          status: 'Confirmada' // Status da compra
        };

        // Salva a compra no backend (JSON Server, por exemplo)
        this.comprasService.salvarCompra(compra).subscribe({
          next: (compraSalva) => { // Se a compra for salva com sucesso
            console.log('Compra salva com sucesso:', compraSalva); // Loga no console
            alert('Compra realizada com sucesso! Obrigado pela preferência.'); // Mostra mensagem de sucesso

            // Limpa o carrinho após a compra
            this.carrinhoService.limparCarrinho(); // Limpa todos os itens do carrinho

            // Redireciona para uma página de sucesso ou home
            this.router.navigate(['/home']); // Redireciona para a home
            this.processandoCompra = false; // Finaliza o processamento
          },
          error: (erro) => { // Se houver erro ao salvar a compra
            console.error('Erro ao salvar compra:', erro); // Loga o erro
            alert('Erro ao processar a compra. Tente novamente.'); // Mostra mensagem de erro
            this.processandoCompra = false; // Finaliza o processamento
          }
        });
      },
      error: (erro) => { // Se não conseguir obter os dados pessoais do usuário
        // Se não conseguir obter o nome, usa o e-mail do usuário
        console.error('Erro ao obter dados do usuário:', erro); // Loga o erro
        const compra: Compra = {
          userId: currentUser.id, // ID do usuário
          nomeUsuario: currentUser.email, // Usa o e-mail como nome
          dataCompra: new Date().toISOString(), // Data da compra
          itens: this.comprasService.converterItensCarrinho(this.itens), // Itens da compra
          subtotal: this.subTotal, // Subtotal
          valorTotal: this.valorFinal, // Valor total
          status: 'Confirmada' // Status
        };

        this.comprasService.salvarCompra(compra).subscribe({
          next: (compraSalva) => { // Se a compra for salva mesmo sem nome
            console.log('Compra salva com sucesso:', compraSalva); // Loga sucesso
            alert('Compra realizada com sucesso! Obrigado pela preferência.'); // Mensagem de sucesso
            this.carrinhoService.limparCarrinho(); // Limpa o carrinho
            this.router.navigate(['/home']); // Redireciona para home
            this.processandoCompra = false; // Finaliza processamento
          },
          error: (erro) => { // Se der erro ao salvar a compra
            console.error('Erro ao salvar compra:', erro); // Loga erro
            alert('Erro ao processar a compra. Tente novamente.'); // Mensagem de erro
            this.processandoCompra = false; // Finaliza processamento
          }
        });
      }
    });
  }

  // Método para trackBy no ngFor (melhora performance ao renderizar listas)
  trackByItem(index: number, item: ItemCarrinho): string {
    return `${item.id}-${item.tamanho}-${item.cor}`; // Retorna uma chave única para cada item
  }
}
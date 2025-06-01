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
  itens: ItemCarrinho[] = [];
  subTotal: number = 0;
  valorFinal: number = 0;
  processandoCompra: boolean = false;

  constructor(
    private carrinhoService: CarrinhoService,
    private authService: AuthService,
    private comprasService: ComprasService,
    private router: Router
  ) {}

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

    // Verifica se o usuário está logado
    if (!this.authService.isLoggedIn()) {
      alert('Você precisa estar logado para finalizar a compra. Redirecionando para o login...');
      this.router.navigate(['/home']); // ou '/login' se você tiver uma rota específica de login
      return;
    }

    this.processandoCompra = true;
    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      alert('Erro ao obter dados do usuário. Tente fazer login novamente.');
      this.processandoCompra = false;
      return;
    }

    // Obtém os dados pessoais do usuário para pegar o nome
    this.authService.getCurrentUserData().subscribe({
      next: (dadosPessoais) => {
        const nomeUsuario = dadosPessoais?.nome || currentUser.email;

        // Cria o objeto da compra
        const compra: Compra = {
          userId: currentUser.id,
          nomeUsuario: nomeUsuario,
          dataCompra: new Date().toISOString(),
          itens: this.comprasService.converterItensCarrinho(this.itens),
          subtotal: this.subTotal,
          valorTotal: this.valorFinal,
          status: 'Confirmada'
        };

        // Salva a compra no JSON Server
        this.comprasService.salvarCompra(compra).subscribe({
          next: (compraSalva) => {
            console.log('Compra salva com sucesso:', compraSalva);
            alert('Compra realizada com sucesso! Obrigado pela preferência.');

            // Limpa o carrinho após a compra
            this.carrinhoService.limparCarrinho();

            // Redireciona para uma página de sucesso ou home
            this.router.navigate(['/home']);
            this.processandoCompra = false;
          },
          error: (erro) => {
            console.error('Erro ao salvar compra:', erro);
            alert('Erro ao processar a compra. Tente novamente.');
            this.processandoCompra = false;
          }
        });
      },
      error: (erro) => {
        console.error('Erro ao obter dados do usuário:', erro);
        // Continua com o email se não conseguir obter o nome
        const compra: Compra = {
          userId: currentUser.id,
          nomeUsuario: currentUser.email,
          dataCompra: new Date().toISOString(),
          itens: this.comprasService.converterItensCarrinho(this.itens),
          subtotal: this.subTotal,
          valorTotal: this.valorFinal,
          status: 'Confirmada'
        };

        this.comprasService.salvarCompra(compra).subscribe({
          next: (compraSalva) => {
            console.log('Compra salva com sucesso:', compraSalva);
            alert('Compra realizada com sucesso! Obrigado pela preferência.');
            this.carrinhoService.limparCarrinho();
            this.router.navigate(['/home']);
            this.processandoCompra = false;
          },
          error: (erro) => {
            console.error('Erro ao salvar compra:', erro);
            alert('Erro ao processar a compra. Tente novamente.');
            this.processandoCompra = false;
          }
        });
      }
    });
  }

  // Método para trackBy no ngFor (melhora performance)
  trackByItem(index: number, item: ItemCarrinho): string {
    return `${item.id}-${item.tamanho}-${item.cor}`;
  }
}

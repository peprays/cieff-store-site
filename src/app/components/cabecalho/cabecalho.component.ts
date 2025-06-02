import { Component } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cabecalho',
  imports: [
    RouterModule,
    CommonModule,
  ],
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.scss'
})
export class CabecalhoComponent {
  isMenuOpen = false; // Controla se o menu do usuário (dropdown) está aberto ou fechado

  constructor(
    private dialog: Dialog, // Serviço para abrir modais
    private router: Router, // Serviço de navegação de rotas
    public authService: AuthService // Serviço de autenticação, usado para verificar login e manipular usuário
  ) {}

  // Abre o modal de login ao clicar no botão de login
  openModalLogin() {
    this.dialog.open(ModalLoginComponent, {}); // Abre o componente ModalLoginComponent como modal
  }

  // Alterna a visibilidade do menu do usuário (dropdown)
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Inverte o valor de isMenuOpen (abre/fecha o menu)
  }

  // Faz logout do usuário, limpa dados e redireciona para a home
  logout() {
    this.authService.clearUser(); // Limpa os dados do usuário autenticado
    this.isMenuOpen = false; // Fecha o menu do usuário
    this.router.navigate(['/']); // Redireciona para a página inicial
  }
}
import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service'; // Novo import

@Component({
  selector: 'app-modal-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.scss']
})
export class ModalLoginComponent {
  passwordInvalid = false; // Indica se a senha está incorreta
  errorMessage = ''; // Mensagem de erro para exibir ao usuário
  isClosing = false; // Controla animação de fechamento do modal
  email = ''; // Armazena o e-mail digitado
  password = ''; // Armazena a senha digitada

  constructor(
    @Inject(DIALOG_DATA) public data: any, // Dados injetados no modal (não usado aqui)
    private dialogRef: DialogRef<ModalLoginComponent>, // Referência ao modal para fechar
    private userService: UserService, // Serviço de usuário para login/registro
    private authService: AuthService, // Serviço de autenticação
    private router: Router // Serviço de navegação
  ) {
  }

  // Função para fechar o modal com animação
  close() {
    this.isClosing = true; // Ativa a animação de fechamento
    setTimeout(() => {
      this.dialogRef.close(); // Fecha o modal após 300ms
    }, 300);
  }

  // Função chamada ao submeter o formulário de login
  login() {
    this.passwordInvalid = false; // Reseta o estado de senha inválida
    this.errorMessage = ''; // Limpa mensagens de erro anteriores

    // Verifica se os campos de e-mail e senha estão preenchidos
    if (this.email && this.password) {
      // Chama o serviço de login ou registro
      this.userService.loginOrRegister(this.email, this.password).subscribe({
        next: user => {
          console.log('Login bem-sucedido:', user); // Loga o usuário retornado
          this.authService.setUser(user); // Armazena usuário logado
          this.close(); // Fecha o modal de login

          // ✅ Verifica se o ID é "ff33" (admin)
          if (user.id === 'ff33') {
            window.location.href = 'http://localhost:49469/'; // Redireciona para dashboard de admin
          } else {
            this.router.navigate(['/']); // Redireciona para home
          }
        },
        error: err => {
          console.error('Erro no login:', err); // Loga o erro
          if (err.message === 'Senha incorreta') {
            this.passwordInvalid = true; // Marca senha como inválida
            this.errorMessage = 'Senha incorreta. Tente novamente.'; // Mensagem específica
          } else {
            this.errorMessage = 'Erro ao fazer login.'; // Mensagem genérica
          }
        }
      });
    } else {
      this.errorMessage = 'Preencha todos os campos.'; // Mensagem se algum campo estiver vazio
    }
  }
}
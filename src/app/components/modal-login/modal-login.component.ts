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
  passwordInvalid = false;
  errorMessage = '';
  isClosing = false;
  email = '';
  password = '';

  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private dialogRef: DialogRef<ModalLoginComponent>,
    private userService: UserService,
    private authService: AuthService, // Novo
    private router: Router // Novo
  ) {
  }

  close() {
    this.isClosing = true;
    setTimeout(() => {
      this.dialogRef.close();
    }, 300);
  }

  login() {
    this.passwordInvalid = false;
    this.errorMessage = '';

    if (this.email && this.password) {
      this.userService.loginOrRegister(this.email, this.password).subscribe({
        next: user => {
          console.log('Login bem-sucedido:', user);
          this.authService.setUser(user); // Armazena usuário logado
          this.close();

          // ✅ Verifica se o ID é "ff33" (admin)
          if (user.id === 'ff33') {
            window.location.href = 'http://localhost:49469/'; // Redireciona para dashboard
          } else {
            this.router.navigate(['/']); // Redireciona para home
          }
        },
        error: err => {
          console.error('Erro no login:', err);
          if (err.message === 'Senha incorreta') {
            this.passwordInvalid = true;
            this.errorMessage = 'Senha incorreta. Tente novamente.';
          } else {
            this.errorMessage = 'Erro ao fazer login.';
          }
        }
      });
    } else {
      this.errorMessage = 'Preencha todos os campos.';
    }
  }
}

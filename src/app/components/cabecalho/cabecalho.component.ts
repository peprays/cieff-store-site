import { Component } from '@angular/core';
import {Dialog} from '@angular/cdk/dialog';
import {ModalLoginComponent} from '../modal-login/modal-login.component';
import {RouterLink, RouterModule} from '@angular/router';
import {Router} from '@angular/router';
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
  isMenuOpen = false;
  constructor(
    private dialog: Dialog,
    private router: Router,
    public authService: AuthService
  ) {}
  openModalLogin(){
    this.dialog.open(ModalLoginComponent, {})
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.clearUser();
    this.isMenuOpen = false;
    this.router.navigate(['/']);
  }
}


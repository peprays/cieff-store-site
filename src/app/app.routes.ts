import { Routes } from '@angular/router';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import {CabecalhoComponent} from './components/cabecalho/cabecalho.component';
import {PaginaPrincipalComponent} from './components/pagina-principal/pagina-principal.component';

export const routes: Routes = [
  { path: '', component: PaginaPrincipalComponent },
  { path: 'carrinho', component: CarrinhoComponent },
];

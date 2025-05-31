import { Routes } from '@angular/router';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import {CabecalhoComponent} from './components/cabecalho/cabecalho.component';
import {PaginaPrincipalComponent} from './components/pagina-principal/pagina-principal.component';
import {DadosPessoaisComponent} from './components/daodos-user/daodos-user.component';

export const routes: Routes = [
  {path: '', component: PaginaPrincipalComponent },
  {path: 'carrinho', component: CarrinhoComponent },
  {path: 'dados', component: DadosPessoaisComponent },
  /*{path: 'dashboard', component: DashboardComponent },*/
];

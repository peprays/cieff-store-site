import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import { CabecalhoComponent } from "./components/cabecalho/cabecalho.component";
import { CatalogoComponent } from "./components/catalogo/catalogo.component";
import { NovidadesComponent } from './components/novidades/novidades.component';
import { SobrenosComponent } from './components/sobrenos/sobrenos.component';
import { FooterComponent } from './components/footer/footer.component';
import {ModalLoginComponent} from './components/modal-login/modal-login.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CabecalhoComponent, CatalogoComponent, NovidadesComponent, SobrenosComponent, FooterComponent,ModalLoginComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}

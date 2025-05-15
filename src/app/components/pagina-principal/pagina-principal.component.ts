import { Component } from '@angular/core';
import {CabecalhoComponent} from '../cabecalho/cabecalho.component';
import {CatalogoComponent} from '../catalogo/catalogo.component';
import {ModalLoginComponent} from '../modal-login/modal-login.component';
import {ModalComponent} from '../modal/modal.component';
import {FooterComponent} from '../footer/footer.component';
import {NovidadesComponent} from '../novidades/novidades.component';
import {SobrenosComponent} from '../sobrenos/sobrenos.component';

@Component({
  selector: 'app-pagina-principal',
  imports: [CabecalhoComponent, CatalogoComponent, FooterComponent, NovidadesComponent, SobrenosComponent],
  templateUrl: './pagina-principal.component.html',
  styleUrl: './pagina-principal.component.scss'
})
export class PaginaPrincipalComponent {

}

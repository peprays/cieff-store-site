import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';

@Component({
  selector: 'app-modal-login',
  imports: [],
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.scss'],
})
export class ModalLoginComponent {
  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private dialogRef: DialogRef<ModalLoginComponent>
  ) {}

  isClosing = false;

  close() {
    this.isClosing = true;

    // Aguarda a animação terminar
    setTimeout(() => {
      this.dialogRef.close();
    }, 0); // 300ms = tempo da transição
  }
}

import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private dialogRef: DialogRef<ModalComponent>
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

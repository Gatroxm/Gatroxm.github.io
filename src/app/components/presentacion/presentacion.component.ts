import { ChangeDetectionStrategy, Component } from '@angular/core';
import ModalComponent from '../shared/modal/modal.component';

@Component({
  selector: 'app-presentacion',
  imports: [ModalComponent],
  templateUrl: './presentacion.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './presentacion.component.scss',
})
export default class PresentacionComponent {
  public modal: boolean = false;

  closeModal() {
    this.modal = false;
  }
}

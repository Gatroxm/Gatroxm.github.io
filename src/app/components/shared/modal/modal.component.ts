import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './modal.component.scss',
})
export default class ModalComponent {
  @Output() closeModalEmit: EventEmitter<any> = new EventEmitter();

  closeModal() {
    this.closeModalEmit.emit(false);
  }
}

import { Component, Output, EventEmitter } from '@angular/core';
import {} from 'node:stream';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export default class ModalComponent {
  @Output() closeModalEmit: EventEmitter<any> = new EventEmitter();

  closeModal() {
    this.closeModalEmit.emit(false);
  }
}

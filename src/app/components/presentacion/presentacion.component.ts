import { Component } from '@angular/core';
import ModalComponent from '../shared/modal/modal.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-presentacion',
  standalone: true,
  imports: [ModalComponent, NgIf],
  templateUrl: './presentacion.component.html',
  styleUrl: './presentacion.component.scss',
})
export default class PresentacionComponent {
  public modal: boolean = false;

  closeModal(event: any) {
    this.modal = false;
  }
}

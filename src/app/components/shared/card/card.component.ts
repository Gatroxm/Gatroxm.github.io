import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgFor],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export default class CardComponent {
  @Input() repos: any;
}

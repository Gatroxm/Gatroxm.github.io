import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export default class HeaderComponent {
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.menuOpen = false; // Cerrar el menú después de hacer clic en un enlace
  }
}

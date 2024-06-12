import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import GithubComponent from './components/github/github.component';
import FooterComponent from './components/footer/footer.component';
import PresentacionComponent from './components/presentacion/presentacion.component';
import HabilidadesComponent from './components/habilidades/habilidades.component';
import CursosComponent from './components/cursos/cursos.component';
import HeaderComponent from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    GithubComponent,
    FooterComponent,
    PresentacionComponent,
    HabilidadesComponent,
    CursosComponent,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const sections = document.querySelectorAll('section');
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            observer.unobserve(entry.target);
          }
        });
      }, options);

      sections.forEach((section) => {
        observer.observe(section);
      });
    }
  }

  title = 'Portafolio';
}

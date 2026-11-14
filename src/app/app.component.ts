import {
  Component,
  AfterViewInit,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

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

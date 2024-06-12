import { NgFor, NgStyle } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-habilidades',
  standalone: true,
  imports: [NgFor, NgStyle],
  templateUrl: './habilidades.component.html',
  styleUrl: './habilidades.component.scss',
})
export default class HabilidadesComponent {
  habilidades = [
    {
      name: 'JavaScript',
      description: 'Lenguaje de programación de código abierto',
      percent: 90,
    },
    {
      name: 'Angular',
      description: 'Framework de desarrollo web',
      percent: 80,
    },
    {
      name: 'React.js',
      description: 'Framework de desarrollo web',
      percent: 60,
    },
    {
      name: 'TypeScript',
      description: 'Lenguaje de programación de código abierto',
      percent: 80,
    },
    {
      name: 'Express',
      description: 'Framework web',
      percent: 70,
    },
    {
      name: 'MongoDB',
      description: 'Base de datos',
      percent: 60,
    },
    {
      name: 'HTML5',
      description: 'Lenguaje de marcado',
      percent: 100,
    },
    {
      name: 'CSS3',
      description: 'Lenguaje de marcado',
      percent: 95,
    },
    {
      name: 'Sass',
      description: 'Lenguaje de programación de código abierto',
      percent: 100,
    },
    {
      name: 'Less',
      description: 'Lenguaje de programación de código abierto',
      percent: 90,
    },
    {
      name: 'WordPress',
      description: 'Sistema de gestión de contenido',
      percent: 60,
    },
    {
      name: 'PHP',
      description: 'Lenguaje de programación',
      percent: 60,
    },
    {
      name: 'GitHub',
      description: 'Sistema de control de versiones',
      percent: 75,
    },
  ];
}

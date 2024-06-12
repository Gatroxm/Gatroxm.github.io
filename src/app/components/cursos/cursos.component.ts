import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import CardComponent from '../shared/card/card.component';

interface Course {
  name: string;
  description: string;
  html_url: string;
}

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [NgFor, CardComponent],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.scss',
})
export default class CursosComponent {
  courses: Course[] = [
    {
      name: 'Legacy - Node: De cero a experto',
      description:
        'El curso de Node.js desde cero a experto, con ejemplos prácticos, de cómo crear aplicaciones web y móviles con Node.js.',
      html_url: 'https://www.udemy.com/certificate/UC-YURSS5S0/',
    },
    {
      name: 'React: De cero a experto ( Hooks y MERN ) ',
      description:
        'El curso de React desde cero a experto, con ejemplos prácticos, de cómo crear aplicaciones web y móviles con React.',
      html_url:
        'https://www.udemy.com/certificate/UC-4d0545ba-bfc0-456e-8f51-42064be62193/',
    },
    {
      name: 'Angular Avanzado: Lleva tus bases al siguiente nivel - MEAN',
      description:
        'El curso de Angular desde cero a experto, con ejemplos prácticos, de cómo crear aplicaciones web y móviles con Angular, conectando a MongoDB, Express y Node.js.',
      html_url:
        'https://www.udemy.com/certificate/UC-85e91ac3-2a4e-4db0-b26c-25d0d98b99c5/',
    },
    {
      name: 'Angular: Convierte cualquier template HTML en una WebAPP',
      description:
        'Enseña a convertir cualquier plantilla HTML en una aplicación web con Angular.',
      html_url: 'https://www.udemy.com/certificate/UC-X7ZOI6SN/',
    },
    {
      name: ' Introducción a Angular 4 - Instalación y componentes',
      description: 'Enseña a desarrollar aplicaciones web con Angular.',
      html_url:
        'https://www.udemy.com/certificate/UC-14385d5d-c236-4671-b11c-c020deea0c74/',
    },
    {
      name: '  SQL. Curso completo de SQL. Aprende desde cero. Comandos SQL ',
      description:
        'Enseña a ejecutar comandos SQL desde el programa SQL Server.',
      html_url: 'https://www.udemy.com/certificate/UC-SA0OCXIM/',
    },
    {
      name: '  Angular: De cero a experto (Legacy) ',
      description: 'Enseña a desarrollar aplicaciones web con Angular.',
      html_url: 'https://www.udemy.com/certificate/UC-UZT96S0U/',
    },
    {
      name: ' Visual Studio Code: Mejora tu velocidad para codificar',
      description: 'Enseña el manejo de Visual Studio Code.',
      html_url: 'https://www.udemy.com/certificate/UC-5EE2YHPN/',
    },
  ];
}

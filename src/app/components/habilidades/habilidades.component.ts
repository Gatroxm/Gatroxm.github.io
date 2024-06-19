import { NgFor, NgStyle, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';

interface Habilidad {
  icon: string;
  name: string;
}
@Component({
  selector: 'app-habilidades',
  standalone: true,
  imports: [NgFor, NgStyle, UpperCasePipe],
  templateUrl: './habilidades.component.html',
  styleUrl: './habilidades.component.scss',
})
export default class HabilidadesComponent {
  habilidades: Habilidad[] = [
    {
      icon: 'angular.svg',
      name: 'Angular',
    },
    {
      icon: 'html.svg',
      name: 'HTML',
    },
    {
      icon: 'css3.svg',
      name: 'CSS',
    },
    {
      icon: 'js.svg',
      name: 'Javascript',
    },

    {
      icon: 'nodejs.svg',
      name: 'Nodejs',
    },
    {
      icon: 'bootstrap.svg',
      name: 'Bootstrap',
    },
    {
      icon: 'bitbucket.svg',
      name: 'Bitbucket',
    },
    {
      icon: 'github.svg',
      name: 'Github',
    },
    {
      icon: 'express.svg',
      name: 'Express',
    },
    {
      icon: 'woocommerce.svg',
      name: 'Woocommerce',
    },
    {
      icon: 'sql.svg',
      name: 'SQL',
    },
    {
      icon: 'mysql.svg',
      name: 'Mysql',
    },
    {
      icon: 'shopify.svg',
      name: 'Shopify',
    },
    {
      icon: 'java.svg',
      name: 'Java',
    },
    {
      icon: 'ts.svg',
      name: 'Typescript',
    },
    {
      icon: 'jira.svg',
      name: 'Jira',
    },
    {
      icon: 'laravel.svg',
      name: 'Laravel',
    },
    {
      icon: 'php.svg',
      name: 'PHP',
    },
    {
      icon: 'less.svg',
      name: 'Less',
    },
    {
      icon: 'sass.svg',
      name: 'Sass',
    },
    {
      icon: 'mongodb.svg',
      name: 'Mongodb',
    },
    {
      icon: 'nestjs.svg',
      name: 'Nestjs',
    },
    {
      icon: 'reactjs.svg',
      name: 'React',
    },
    {
      icon: 'scrum.svg',
      name: 'SCRUM',
    },
    {
      icon: 'wordpress.svg',
      name: 'Wordpress',
    },
  ];
}

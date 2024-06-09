import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GithubComponent } from './components/github/github.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GithubComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Portafolio';
}

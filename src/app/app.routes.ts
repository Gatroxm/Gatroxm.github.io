import { Routes } from '@angular/router';
import { GithubService } from './services/github.service';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
    providers: [GithubService],
  },
];

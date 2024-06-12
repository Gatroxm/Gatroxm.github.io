import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { GithubService } from './app/services/github.service';

bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('Aplicación iniciada correctamente.'))
  .catch((err) => console.error('Error al iniciar la aplicación:', err)); // Maneja los errores de inicialización

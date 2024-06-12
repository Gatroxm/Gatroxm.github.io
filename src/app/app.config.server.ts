import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { GithubService } from './services/github.service';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(), GithubService],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);

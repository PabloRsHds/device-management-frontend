import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthInterceptorService } from './interceptor/auth-interceptor.service';
import { provideEchartsCore } from 'ngx-echarts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZoneChangeDetection(),
    provideEchartsCore({
      echarts: () => import('echarts')
    }),
    provideHttpClient(withInterceptors([AuthInterceptorService]))
  ]
};

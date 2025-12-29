import { Routes } from '@angular/router';

export const routes: Routes = [
  {path:'', pathMatch:'full', redirectTo:'device'},
  {path:'device', loadChildren: () => import('./router/router/router-routing.module').then(m => m.RouterRoutingModule)}
];

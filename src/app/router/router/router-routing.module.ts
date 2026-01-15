import { LoginComponent } from './../../page1/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceComponent } from '../../page2/device/device.component';
import { authGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'home', component:DeviceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouterRoutingModule { }

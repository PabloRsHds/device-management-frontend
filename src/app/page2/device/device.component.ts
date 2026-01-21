import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { HomeComponent } from "../../components/home/home.component";
import { RegisterComponent } from "../../components/register/register.component";
import { TableDevicesComponent } from "../../components/table-devices/table-devices.component";
import { TableSensorsComponent } from "../../components/table-sensors/table-sensors.component";

export enum MenuType {
  HOME = 0,
  REGISTER = 1,
  TABLE_DEVICES = 2,
  SENSORS = 3
}

@Component({
  selector: 'app-device',
  imports: [CommonModule, SidebarComponent, HomeComponent, RegisterComponent, TableDevicesComponent, TableSensorsComponent],
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent {

  // Enum de opções
  menuOptions = MenuType;

  // Menu selecionado no sidebar
  menuSelected: number = 0;
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-device',
  imports: [CommonModule],
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent {

  verification:boolean = false;
  openModalTableInspection = false;
  openModalDeviceUpdate = false;
  openModalDeviceDelete = false;

  name = '';
  type = '';
  model = '';
  description = '';
  manufacturer = '';
  minLimit = 0;
  maxLimit = 0;
  unit = '';
  location = '';

  buttons = [
    {id: 1, title: 'Add Device', pressed : false},
    {id: 2, title:'View all Devices', pressed: false},
    {id: 3, title:'Analysis of Devices', pressed: false}
  ];

  // Alterna botões da lista de configurações
  toggleButton(id: number) {
    this.buttons.forEach(button => {
      if (button.id === id) {
        button.pressed = !button.pressed;
      } else {
        button.pressed = false;
      }
    });
  }

  list = [
    {id: 1, name: 'Temperature Sensor', type: 'Sensor', model: 'TS-200', description: 'dasds daasss', manufacturer: 'Acme Corp', minLimit: 0, maxLimit: 100, unit: '°C', location: 'Room 1'},
    {id: 2, name: 'Pressure Gauge', type: 'Gauge', model: 'PG-500', description: 'dasds daasss', manufacturer: 'XYZ Instruments', minLimit: 0, maxLimit: 1000, unit: 'kPa', location: 'Lab A'},
    {id: 3, name: 'Humidity Monitor', type: 'Monitor', model: 'HM-300', description: 'dasds daasss', manufacturer: 'WeatherTech', minLimit: 0, maxLimit: 100, unit: '%', location: 'Storage Room'},
  ]

  sensorTesting(id : number){

    this.openModalTableInspection = !this.openModalTableInspection;

    this.list.map(
      (item) => {
        if(item.id === id){
          this.name = item.name;
          this.type = item.type;
          this.model = item.model;
          this.description = item.description;
          this.manufacturer = item.manufacturer;
          this.minLimit = item.minLimit;
          this.maxLimit = item.maxLimit;
          this.unit = item.unit;
          this.location = item.location;
        }
      }
    )
  }
}

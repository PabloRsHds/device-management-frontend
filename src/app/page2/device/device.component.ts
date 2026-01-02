import { CrudService } from './../../service/crud.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { RegisterDevice } from '../../interfaces/RegisterDevice';
import { DeviceAnalysisDto } from '../../interfaces/DeviceAnalysisDto';


@Component({
  selector: 'app-device',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent {

  verification:boolean = false;
  openModalTableInspection = false;
  openModalDeviceUpdate = false;
  openModalDeviceDelete = false;
  deviceModel!: DeviceAnalysisDto;
  registerForm!: FormGroup;
  listDevices: RegisterDevice[] = [];
  listDevicesAnalysis: DeviceAnalysisDto[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService) {}

  ngOnInit() {
    this.allDevices();
    this.configurationForm();
    this.allDevicesAnalysis();
  }

  onSubmit() {
    this.crudService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Device registered successfully:', response);
        this.registerForm.reset();
        this.allDevices();
      },
      error: (error) => {
        console.error('Error registering device:', error);
      }
    });
  }

  reloadAnalysis() {
    this.allDevicesAnalysis();
  }

  allDevicesAnalysis() {
    this.crudService.allDevicesAnalysis().subscribe({
      next: (response) => {
        this.listDevicesAnalysis = response;
        this.deviceModel = response[0];
      },
      error: (error) => {
        console.error('Error registering device:', error);
      }
    });
  }

  allDevices() {
    this.crudService.allDevices().subscribe({
      next: (response) => {
        this.listDevices = response;
      },
      error: (error) => {
        console.error('Error registering device:', error);
      }
    });
  }


  deviceForAnalysis(deviceModel: string) {

    this.crudService.findDeviceModelForAnalysis(deviceModel).subscribe({
      next: (response) => {
        this.openModalTableInspection = !this.openModalTableInspection;
        this.deviceModel = response;
      },
      error: (error) => {
        console.error('Error registering device:', error);
      }
    });
  }

  configurationForm() {

    this.registerForm = this.formBuilder.group({
      name: [''],
      type: [''],
      deviceModel: [''],
      description: [''],
      manufacturer: [''],
      minLimit: [''],
      maxLimit: [''],
      unit: [''],
      location: ['']
    });
  }

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
}

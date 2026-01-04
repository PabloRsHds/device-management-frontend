import { CrudService } from './../../service/crud.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { RegisterDevice } from '../../interfaces/RegisterDevice';
import { DeviceAnalysisDto } from '../../interfaces/DeviceAnalysisDto';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';


@Component({
  selector: 'app-device',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './device.component.html',
  styleUrl: './device.component.css'
})
export class DeviceComponent {

  //Updates
  updateDeviceName = false;
  updateDeviceModel = false;
  updateManufacturer = false;
  updateLocation = false;
  updateDescription = false;
  //

  verification:boolean = false;
  openModalTableInspection = false;
  openModalDeviceUpdate = false;
  openModalDeviceDelete = false;

  deviceModel:string = '';

  deviceAnalysis!: DeviceAnalysisDto;
  registerForm!: FormGroup;
  updateForm!: FormGroup;
  deleteForm!: FormGroup;
  listDevices: RegisterDevice[] = [];
  listDevicesAnalysis: DeviceAnalysisDto[] = [];

  openModalDescription = false;
  selectedDeviceDescription: string = '';

  openModalLocation = false;
  selectedDeviceLocation: string = '';


  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.allDevices();
    // Inicializo o formulário
    this.configurationForm();
    // Inicializo o formulário de atualização
    this.configurationUpdateForm();
    // Inicializo o formulário de exclusão
    this.configurationDeleteForm();
    this.allDevicesAnalysis();
  }

  functionTableInspection(device: string) {
    this.openModalDescription = true;
    this.selectedDeviceDescription = device;
  }

  //============= Registrar dispositivo ==================

  //Criando formulário
  configurationForm() {

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      deviceModel: ['', Validators.required],
      description: ['', Validators.required],
      manufacturer: ['', Validators.required],
      minLimit: ['', Validators.required],
      maxLimit: ['', Validators.required],
      unit: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  // Função de registro
  register() {
    this.crudService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Device registered successfully:', response);
        this.registerForm.reset();
        this.allDevices();
        this.snackBar.open('Device registered successfully!', 'Close', {
          duration: 3000,
          panelClass : ['snackbar']
        });
      },
      error: (error) => {
        console.error('Error registering device:', error);
      }
    });
  }

  // ===============================================================



  // ================== Update de dispositivos ==============================

  configurationUpdateForm() {
    this.updateForm = this.formBuilder.group({
      deviceModel: '',
      newName: null,
      newDeviceModel: null,
      newManufacturer: null,
      newLocation: null,
      newDescription: null
    });
  }

  update() {

    this.crudService.update(this.deviceModel,this.updateForm.value).subscribe({
      next: (response) => {
        console.log('Device updated successfully:', response);
        this.updateForm.reset();
        this.openModalDeviceUpdate = !this.openModalDeviceUpdate;
        this.allDevices();
        this.snackBar.open('Device updated successfully!', 'Close', {
          duration: 3000,
          panelClass : ['snackbar']
        });
      },
      error: (error) => {
        console.error('Error updated device:', error);
      }
    });

  }

  functionButtonUpdate(deviceModel: string) {
    this.deviceModel = deviceModel;
    this.openModalDeviceUpdate = !this.openModalDeviceUpdate;
  }

  closeModalDeviceUpdate() {
    this.openModalDeviceUpdate = !this.openModalDeviceUpdate;
    this.updateDeviceName = false;
    this.updateDeviceModel = false;
    this.updateManufacturer = false;
    this.updateLocation = false;
    this.updateDescription = false;
  }

  // ===============================================================

  // ================= Delete de dispositivos ==============================


  configurationDeleteForm() {
    this.deleteForm = this.formBuilder.group({
      deviceModel: ''
    });
  }

  functionButtonDelete(deviceModel: string) {
    this.deviceModel = deviceModel;
    this.openModalDeviceDelete = !this.openModalDeviceDelete;
  }

  delete() {

    this.crudService.delete(this.deviceModel).subscribe({
      next: (response) => {
        console.log('Device deleted successfully:', response);
        this.deleteForm.reset();
        this.openModalDeviceDelete = !this.openModalDeviceDelete;
        this.allDevices();
        this.snackBar.open('Device deleted successfully!', 'Close', {
          duration: 3000,
          panelClass : ['snackbar']
        });
      },
      error: (error) => {
        console.error('Error deleting device:', error);
      }
    });
  }

  // =======================================================================

  reloadAnalysis() {
    this.allDevicesAnalysis();
  }

  allDevicesAnalysis() {
    this.crudService.allDevicesAnalysis().subscribe({
      next: (response) => {
        this.listDevicesAnalysis = response;
        this.deviceAnalysis = response[0];
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
        this.deviceAnalysis = response;
      },
      error: (error) => {
        console.error('Error registering device:', error);
      }
    });
  }




  // ================= Configuração dos tipos de dispositivos ===================
  types: string[] = [
    'GAS_SENSOR',
    'THERMISTOR',
    'THERMOCOUPLE',
    'DISTANCE_SENSOR',
    'TEMPERATURE_SENSOR',
    'HUMIDITY_SENSOR',
    'AMBIENT_LIGHT_SENSOR',
    'TOF_SENSOR',
    'STRAIN_GAUGE',
    'CO2_SENSOR',
    'TURBIDITY_SENSOR',
    'UV_SENSOR',
    'ULTRASONIC_SENSOR',
    'PROXIMITY_SENSOR',
    'LOAD_CELL',
    'PH_SENSOR',
    'LIGHT_SENSOR',
    'MAGNETOMETER',
    'GYROSCOPE',
    'FLAME_SENSOR',
    'VIBRATION_SENSOR',
    'MICROPHONE',
    'FLOW_SENSOR',
    'CO_SENSOR',
    'FORCE_SENSOR',
    'VOC_SENSOR',
    'IMU',
    'PRESSURE_SENSOR',
    'WATER_LEVEL_SENSOR',
    'PIR_SENSOR',
    'SOUND_SENSOR',
    'AIR_QUALITY_SENSOR',
    'MOTION_SENSOR',
    'SMOKE_SENSOR',
    'ACCELEROMETER',
    'LIDAR_SENSOR'
  ];
  // =============================================================


  // ================= Configuração das unidades ===================
  units: string[] = [
    'CELSIUS',
    'FAHRENHEIT',
    'KELVIN',
    'PERCENTAGE',
    'PPM',
    'PPB',
    'MG_M3',
    'PASCAL',
    'HECTOPASCAL',
    'BAR',
    'PSI',
    'METER',
    'CENTIMETER',
    'MILLIMETER',
    'LITER_PER_MINUTE',
    'METER_PER_SECOND',
    'LUX',
    'DECIBEL',
    'NEWTON',
    'KILOGRAM_FORCE',
    'VOLT',
    'AMPERE',
    'OHM'
  ];
  // =============================================================


  // ================= Configuração dos botões ===================

  // Lista de botões
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

  //===============================================================
}

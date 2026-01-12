import { CrudService } from './../../service/crud.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { DeviceAnalysisDto } from '../../interfaces/DeviceAnalysisDto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AllDevices } from '../../interfaces/AllDevices';
import { AllSensors } from '../../interfaces/AllSensors';
import { Notifications } from '../../interfaces/Notifications';


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

  //Pesquisa
  searchTerm: string = ''; // Variável para armazenar o termo de searchTerm
  currentPage = 1;
  itemsPerPage = 6;
  //

  //Pesquisa analysis
  searchTermAnalysis: string = ''; // Variável para armazenar o termo de searchTerm
  currentPageAnalysis = 1;
  itemsPerPageAnalysis = 6;
  //

  //Pesquisa sensors
  searchTermSensors: string = ''; // Variável para armazenar o termo de searchTerm
  currentPageSensors = 1;
  itemsPerPageSensors = 6;
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
  listDevices: AllDevices[] = [];
  listDevicesAnalysis: DeviceAnalysisDto[] = [];
  listSensorsActivated: AllSensors[] = [];
  listNotifications: Notifications[] = [];

  openModalDescription = false;
  openModalNotifications = false;
  selectedDeviceDescription: string = '';

  openModalLocation = false;
  selectedDeviceLocation: string = '';

  status: string = '';

  formBuilder = inject(FormBuilder);
  crudService = inject(CrudService);
  snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.allDevices();
    // Inicializo o formulário
    this.configurationForm();
    // Pega todos os sensores ativados
    this.getAllSensorsActivated();
  }

  functionTableInspection(device: string) {
    this.openModalDescription = true;
    this.selectedDeviceDescription = device;
  }


  // ================= Retorna todos os dispositivos e salva na lista ==============================

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

  // =========================================================================

  //============= Registrar dispositivo ==================

  //Criando formulário
  configurationForm() {

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      deviceModel: ['', Validators.required],
      description: ['', Validators.required],
      manufacturer: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  // Função de registro
  register() {
    this.crudService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.registerForm.reset(
          {
            type: '',
            unit: ''
          }
        );
        this.allDevices();
        this.snackBar.open(response, 'Close', {
          duration: 3000,
          panelClass : ['snackbar']
        });
      },
      error: (error: Error) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 3000,
          panelClass : ['snackbar']
        });
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

    this.configurationUpdateForm();

    this.crudService.findDeviceWithDeviceModel(deviceModel).subscribe({
      next: (response) => {
        this.updateForm.patchValue({
          deviceModel: response.deviceModel,
          newName: response.name,
          newDeviceModel: response.deviceModel,
          newManufacturer: response.manufacturer,
          newLocation: response.location,
          newDescription: response.description
        });
      },
      error: (error) => {
        console.error('Error updating device:', error);
      }
    });

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


  // Criando formulário
  configurationDeleteForm() {
    this.deleteForm = this.formBuilder.group({
      deviceModel: ''
    });
  }

  // Função de exclusão de dispositivos, onde eu ao clicar no botão pego o deviceModel para utiliza-lo na exclusão
  functionButtonDelete(deviceModel: string) {

    this.configurationDeleteForm();

    this.deviceModel = deviceModel;
    this.openModalDeviceDelete = !this.openModalDeviceDelete;
  }

  // Função de exclusão
  delete() {

    this.deleteForm.patchValue({
      deviceModel: this.deviceModel
    });

    this.crudService.delete(this.deleteForm.value.deviceModel).subscribe({
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

  // ======================================================================


  //Função do teste e analysis
  getAllSensorsActivated() {
    this.crudService.getAllSensorsActivated().subscribe({
      next: (response) => {
        this.listSensorsActivated = response;
      },
      error: (error) => {
        console.error('Error registering device:', error);
      }
    });
  }

  reloadAnalysis() {
    this.deviceForAnalysis(this.deviceModel);
  }

  functionChangeStatus(deviceModel: string) {

    this.crudService.getStatus(deviceModel).subscribe({
      next: (response) => {
        this.status = response;
      },
      error: (error) => {
        console.error('Error registering device:', error);
      }
    });

    this.crudService.changeStatus(deviceModel).subscribe({
      next: (response) => {

        if (this.status === 'ACTIVATED') {

          this.getAllSensorsActivated();
          this.openModalTableInspection = false;
          this.snackBar.open('Sensor turned OFF', 'Close', {
            duration: 3000,
            panelClass : ['snackbar-danger']
          });
        } else if (this.status === 'DEACTIVATED') {

          this.getAllSensorsActivated();
          this.snackBar.open('Sensor turned ON', 'Close', {
          duration: 3000,
          panelClass : ['snackbar-success']
        });
        }

      },
      error: (error) => {
        console.error('Error changing device status:', error);
      }
    });

  }

  deviceForAnalysis(deviceModel: string) {

    this.crudService.findDeviceModelForAnalysis(deviceModel).subscribe({
      next: (response) => {
        this.openModalTableInspection = true;
        this.deviceAnalysis = response;
        this.deviceModel = deviceModel;
      },
      error: (error) => {
        console.error('Error registering device:', error);
      }
    });
  }


  // =======================================================================


  // Filtra os dispositivos com base no termo de pesquisa
  get filteredDevices() {
    const term = this.searchTerm.trim().toLowerCase();

    return this.listDevices.filter(device => {
      return (
        term === '' ||
        device.name.toLowerCase().includes(term) ||
        device.type.toLowerCase().includes(term) ||
        device.deviceModel.toLowerCase().includes(term) ||
        device.manufacturer.toLowerCase().includes(term) ||
        device.unit.toString().toLowerCase().includes(term)
      );
    });
  }

  // Obtém documentos paginados
  get paginatedDevices() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDevices.slice(start, start + this.itemsPerPage);
  }

  // Calcula o total de páginas
  get totalPages(): number {
    return Math.ceil(this.filteredDevices.length / this.itemsPerPage);
  }

  // Avança para a próxima página
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Volta para a página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  // ===============================================================

  // Filtra os dispositivos com base no termo de pesquisa
  get filteredSensorsActivated() {
    const term = this.searchTermSensors.trim().toLowerCase();

    return this.listSensorsActivated.filter(device => {
      return (
        term === '' ||
        device.name.toLowerCase().includes(term) ||
        device.type.toLowerCase().includes(term) ||
        device.deviceModel.toLowerCase().includes(term) ||
        device.manufacturer.toLowerCase().includes(term) ||
        device.status.toLowerCase().includes(term)
      );
    });
  }

  // Obtém documentos paginados
  get paginateSensorsActivated() {
    const start = (this.currentPageSensors - 1) * this.itemsPerPageSensors;
    return this.filteredSensorsActivated.slice(start, start + this.itemsPerPageSensors);
  }

  // Calcula o total de páginas
  get totalPagesSensorsActivated(): number {
    return Math.ceil(this.filteredSensorsActivated.length / this.itemsPerPageSensors);
  }

  // Avança para a próxima página
  nextPageSensorsActivated() {
    if (this.currentPageSensors < this.totalPagesSensorsActivated) {
      this.currentPageSensors++;
    }
  }

  // Volta para a página anterior
  previousPageSensorsActivated() {
    if (this.currentPageSensors > 1) {
      this.currentPageSensors--;
    }
  }

  // ===========================================================


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
        this.openModalNotifications = false;
      }
    });
  }

  //===============================================================

  loading = false;
  hasMore = true;

  page = 0;
  size = 4;

  openNotifications() {
    this.openModalNotifications = !this.openModalNotifications;
    this.page = 0;
    this.listNotifications = [];
    this.hasMore = true;

    this.loadMore();
  }


  loadMore() {
    if (this.loading || !this.hasMore) {
      return;
    }

    this.loading = true;

    this.crudService.notifications(this.page, this.size).subscribe({
      next: (response) => {

        if (response.length < this.size) {
          this.hasMore = false; // não tem mais dados
        }

        this.listNotifications.push(...response);
        this.page++;

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;

    const chegouNoFim =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 5;

    if (chegouNoFim) {
      this.loadMore();
    }
  }

}

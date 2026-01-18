import { CrudService } from './../../service/crud.service';
import { Component, Inject, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { AllDevices } from '../../interfaces/AllDevices';
import { NotificationComponent } from "../notification/notification.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateComponent } from "../update/update.component";


@Component({
  selector: 'app-table-devices',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NotificationComponent, UpdateComponent],
  templateUrl: './table-devices.component.html',
  styleUrl: './table-devices.component.css'
})
export class TableDevicesComponent {

  @Input() reloadTableDevices?: number;

  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 5;

  status: string = '';

  openModalUpdate = false;

  deviceModel: string = '';

  functionGetDeviceModel(deviceModel: string) {
    this.deviceModel = deviceModel;
    this.openModalUpdate = !this.openModalUpdate;
  }


  openModalDescription = false;
  openModalTableInspection = false;
  selectedDeviceDescription: string = '';

  listDevices: AllDevices[] = [];

  crudService = inject(CrudService);
  snackBar = inject(MatSnackBar)

  ngOnInit(): void {
    this.allDevices();
  }

  ngOnChanges(): void {
    this.allDevices();
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
  };

  functionTableInspection(device: string) {
    this.openModalDescription = true;
    this.selectedDeviceDescription = device;
  }

  functionChangeStatus(deviceModel: string) {

    // Pega o valor do status do dispositivo para fazer uma verificação no serviço abaixo
    this.crudService.getStatus(deviceModel).subscribe({
      next: (response) => {
        this.status = response;
      },
      error: (error) => {
        console.error('Error registering device:', error);
      }
    });

    // Recebe o status do dispositivo e faz uma verificação
    this.crudService.changeStatus(deviceModel).subscribe({
      next: (response) => {

        if (this.status === 'ACTIVATED') {

          //this.getAllSensorsActivated(); algo a implementar
          this.openModalTableInspection = false;
          this.snackBar.open('Sensor turned OFF', 'Close', {
            duration: 3000,
            panelClass : ['snackbar-danger']
          });
        } else if (this.status === 'DEACTIVATED') {

          //this.getAllSensorsActivated(); algo a implementar
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

  functionButtonUpdate(deviceModel: string) {
  }

    //this.configurationUpdateForm(); ve isso aqui dps

    //this.crudService.findDeviceWithDeviceModel(deviceModel).subscribe({
     // next: (response) => {
      //  this.updateForm.patchValue({
      //    deviceModel: response.deviceModel,
      //    newName: response.name,
      //    newDeviceModel: response.deviceModel,
      //    newManufacturer: response.manufacturer,
      //    newLocation: response.location,
      //    newDescription: response.description
      //  });
    //  },
   //   error: (error) => {
    //    console.error('Error updating device:', error);
    //  }
   // });

   // this.deviceModel = deviceModel;
   // this.openModalDeviceUpdate = !this.openModalDeviceUpdate;
 // }
}

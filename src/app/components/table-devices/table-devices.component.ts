import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationsComponent } from "../notifications/notifications.component";
import { UpdateComponent } from "../update/update.component";
import { DeleteDeviceComponent } from "../delete-device/delete-device.component";
import { DevicesService } from '../../services/devices/devices.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { SensorsService } from '../../services/sensors/sensors.service';
import { DevicesStateService } from '../../services/state/devices/devices-state.service';

@Component({
  selector: 'app-table-devices',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NotificationsComponent, UpdateComponent, DeleteDeviceComponent],
  templateUrl: './table-devices.component.html',
  styleUrl: './table-devices.component.css'
})
export class TableDevicesComponent {

  snackBar = inject(MatSnackBar);

  private devicesState = inject(DevicesStateService);
  devices$ = this.devicesState.device$;
  private deviceService = inject(DevicesService);
  private sensorsService = inject(SensorsService);

  itemsPerPage = 5;
  searchTerm$ = new BehaviorSubject<string>('');
  currentPage$ = new BehaviorSubject<number>(1);

  openModalDescription = false;
  openModalTableInspection = false;
  selectedDeviceDescription: string = '';

  status: string = '';

  // abre o modal de update ou fecha
  openModalUpdate = false;
  openModalDelete = false;

  // Vai armazenar o deviceModel para o update
  deviceModel: string = '';

  consumerEventCloseModalDeviceDelete() {
    this.openModalDelete = false;
  }

  // ================= Abre o modal de update e pega o deviceModel ==============================
  functionGetDeviceModelForUpdate(deviceModel: string) {
    this.deviceModel = deviceModel;
    this.openModalUpdate = !this.openModalUpdate;
  }

  getEventCloseModalUpdate() {
    this.openModalUpdate = !this.openModalUpdate;
  }
  //=============================================================================================

  functionGetDeviceModelForDelete(deviceModel: string) {
    this.deviceModel = deviceModel;
    this.openModalDelete = !this.openModalDelete;
  }

  ngOnInit(): void {
    this.intializeAllDevices();
  }

  intializeAllDevices() {
    this.deviceService.getAllDevices()
      .subscribe();
  }


  // ========================= Paginacao e busca de dispositivos ===============================================

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.onSearch(input.value);
  }

  filteredDevices$ = combineLatest([
    this.devices$,
    this.searchTerm$
  ]).pipe(
    map(([devices, term]) => {
      const search = term.trim().toLowerCase();

      return devices.filter(device =>
        search === '' ||
        device.name.toLowerCase().includes(search) ||
        device.type.toLowerCase().includes(search) ||
        device.deviceModel.toLowerCase().includes(search) ||
        device.manufacturer.toLowerCase().includes(search) ||
        device.unit.toString().toLowerCase().includes(search)
      );
    })
  );

  paginatedDevices$ = combineLatest([
    this.filteredDevices$,
    this.currentPage$
  ]).pipe(
    map(([sensors, page]) => {
      const start = (page - 1) * this.itemsPerPage;
      return sensors.slice(start, start + this.itemsPerPage);
    })
  );

  totalPages$ = this.filteredDevices$.pipe(
    map(sensors => Math.ceil(sensors.length / this.itemsPerPage))
  );

  nextPage() {
    this.currentPage$.next(this.currentPage$.value + 1);
  }

  previousPage() {
    const current = this.currentPage$.value;
    if (current > 1) {
      this.currentPage$.next(current - 1);
    }
  }

  onSearch(term: string) {
    this.searchTerm$.next(term);
    this.currentPage$.next(1);
  }


  // ================= Abre o modal de description ==============================
  functionTableInspection(device: string) {
    this.openModalDescription = true;
    this.selectedDeviceDescription = device;
  }

  // ============================================================================


  handleChangeStatus(deviceModel: string) {

    this.sensorsService.changeStatusSensor(deviceModel).subscribe({
      next: (response) => {

        if (response.status === 'ACTIVATED') {
          this.snackBar.open('Sensor turned ON', 'Close', {
           duration: 3000,
            panelClass: ['snackbar-success']
          });
        } else {
          this.snackBar.open('Sensor turned OFF', 'Close', {
           duration: 3000,
            panelClass: ['snackbar-danger']
         });
        }
      },
      error: () => {
        this.snackBar.open('Error changing sensor status', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-danger']
        });
      }
    });
  }

}

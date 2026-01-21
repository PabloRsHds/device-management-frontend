import { Component, Inject, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { AllDevices } from '../../interfaces/AllDevices';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateComponent } from "../update/update.component";
import { DevicesService } from '../../services/devices/devices.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { DevicesStateService } from '../../services/states/devices-state.service';
import { NotificationComponent } from "../notification/notification.component";


@Component({
  selector: 'app-table-devices',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, UpdateComponent, NotificationComponent],
  templateUrl: './table-devices.component.html',
  styleUrl: './table-devices.component.css'
})
export class TableDevicesComponent {

  snackBar = inject(MatSnackBar);
  private state = inject(DevicesStateService);
  private service = inject(DevicesService);
  devices$ = this.state.device$;

  itemsPerPage = 6;
  searchTerm$ = new BehaviorSubject<string>('');
  currentPage$ = new BehaviorSubject<number>(1);

  openModalDescription = false;
  openModalTableInspection = false;
  selectedDeviceDescription: string = '';

  listDevices: AllDevices[] = [];

  status: string = '';

  // abre o modal de update ou fecha
  openModalUpdate = false;
  openModalDelete = false;

  // Vai armazenar o deviceModel para o update
  deviceModel: string = '';



  ngOnInit(): void {
    this.InitializeDevices();
  }

  consumerEventCloseModalDeviceDelete() {
    this.openModalDelete = !this.openModalDelete;
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

  functionReloadTableDevicesAfterDelete() {
    this.InitializeDevices();
    this.openModalDelete = !this.openModalDelete;
  }

  functionGetDeviceModelForDelete(deviceModel: string) {
    this.deviceModel = deviceModel;
    this.openModalDelete = !this.openModalDelete;
  }

  // ================= Retorna todos os dispositivos e salva na lista ==============================

  InitializeDevices() {
    this.service.submitGetDevices().subscribe({
      next: (response) => {
        this.listDevices = response;
      }
    });
  }

  // ========================== Paginação ===============================

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
    map(([devices, page]) => {
      const start = (page - 1) * this.itemsPerPage;
      return devices.slice(start, start + this.itemsPerPage);
    })
  );

  totalPages$ = this.filteredDevices$.pipe(
    map(devices => Math.ceil(devices.length / this.itemsPerPage))
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


  //functionGetStatusAndChangeIt(deviceModel: string) {

  //  this.api.getStatusAndChangeIt(deviceModel).subscribe({
   //   next: (response) => {

   //     if (response === 'ACTIVATED') {
   //       this.snackBar.open('Sensor turned OFF', 'Close', {
   //         duration: 3000,
   //         panelClass: ['snackbar-danger']
   //       });
   //     } else {
    //      this.snackBar.open('Sensor turned ON', 'Close', {
   //        duration: 3000,
    //        panelClass: ['snackbar-success']
   //       });
    //    }
    //  },
   //   error: (err) =>{
   ///     console.log('Error registering device:', err);
  //    },
  //  });
  //}
}

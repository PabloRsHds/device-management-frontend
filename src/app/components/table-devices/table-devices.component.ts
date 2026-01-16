import { CrudService } from './../../service/crud.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { AllDevices } from '../../interfaces/AllDevices';


@Component({
  selector: 'app-table-devices',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './table-devices.component.html',
  styleUrl: './table-devices.component.css'
})
export class TableDevicesComponent {

  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 5;

  openModalDescription = false;
  selectedDeviceDescription: string = '';

  listDevices: AllDevices[] = [];

  crudService = inject(CrudService);


  ngOnInit(): void {
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
}

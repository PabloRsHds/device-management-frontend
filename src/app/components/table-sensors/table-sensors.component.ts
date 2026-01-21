import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { SensorsService } from '../../services/sensors/sensors.service';
import { SensorsStateService } from '../../services/state/sensors/sensors-state.service';
import { ModalAnalysisComponent } from "../modal-analysis/modal-analysis.component";

@Component({
  selector: 'app-table-sensors',
  imports: [CommonModule, ModalAnalysisComponent],
  templateUrl: './table-sensors.component.html',
  styleUrl: './table-sensors.component.css'
})
export class TableSensorsComponent {

  private state = inject(SensorsStateService);
  sensors$ = this.state.sensors$;
  private service = inject(SensorsService);


  itemsPerPage = 6;
  searchTerm$ = new BehaviorSubject<string>('');
  currentPage$ = new BehaviorSubject<number>(1);

  deviceModel?: string;
  modalAnalysis = false;

  ngOnInit(){
    this.initializeSensors();
  }

  openModalAnaysis(deviceModel: string) {
    this.modalAnalysis = !this.modalAnalysis
    this.deviceModel = deviceModel
  }

  consumerEventCloseModalAnalysis() {
    this.modalAnalysis = false;
  }

  initializeSensors() {
    this.service.getAllSensorsActivated().subscribe();
  }

  onSearchInput(event: Event) {
      const input = event.target as HTMLInputElement;
      this.onSearch(input.value);
    }

  filteredSensors$ = combineLatest([
    this.sensors$,
    this.searchTerm$
  ]).pipe(
    map(([sensors, term]) => {
      const search = term.trim().toLowerCase();

      return sensors
        // 1️⃣ mostra somente sensores ATIVOS
        .filter(sensor => sensor.status === 'ACTIVATED')

        // 2️⃣ aplica o filtro de busca
        .filter(sensor =>
          search === '' ||
          sensor.name.toLowerCase().includes(search) ||
          sensor.type.toLowerCase().includes(search) ||
          sensor.deviceModel.toLowerCase().includes(search) ||
          sensor.manufacturer.toLowerCase().includes(search)
        );
    })
  );


  paginatedSensors$ = combineLatest([
    this.filteredSensors$,
    this.currentPage$
  ]).pipe(
    map(([devices, page]) => {
      const start = (page - 1) * this.itemsPerPage;
      return devices.slice(start, start + this.itemsPerPage);
    })
  );

  totalPages$ = this.filteredSensors$.pipe(
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

}

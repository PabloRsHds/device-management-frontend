import { inject, Injectable } from '@angular/core';
import { DevicesStateService } from '../state/devices/devices-state.service';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  private state = inject(DevicesStateService);

  getAllDevices() {
    return this.state.getAllDevices();
  }

}

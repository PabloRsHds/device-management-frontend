import { inject, Injectable } from '@angular/core';
import { DevicesStateService } from '../state/devices/devices-state.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  private state = inject(DevicesStateService);

  deleteDevice(deviceModel: string) {
    return this.state.deleteDevice(deviceModel);
  }

}

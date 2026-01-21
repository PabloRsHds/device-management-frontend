import { inject, Injectable } from '@angular/core';
import { SensorsStateService } from '../state/sensors/sensors-state.service';

@Injectable({
  providedIn: 'root'
})
export class SensorsService {

  private state = inject(SensorsStateService);

  getAllSensorsActivated() {
    return this.state.getAllSensorsActivated();
  }

  changeStatusSensor(deviceModel: string) {
    return this.state.changeStatusSensor(deviceModel);
  }
}

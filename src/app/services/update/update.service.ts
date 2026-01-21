import { inject, Injectable } from '@angular/core';
import { UpdateDevice } from '../../interfaces/device/UpdateDevice';
import { HttpService } from '../backend/http.service';
import { DevicesStateService } from '../state/devices/devices-state.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  private state = inject(DevicesStateService);
  private http = inject(HttpService);

  updateDevice(deviceModel: string, request: UpdateDevice) {
    return this.state.updateDevice(deviceModel, request);
  }

  getDeviceForUpdate(deviceModel: string) {
    return this.http.findDeviceWithDeviceModel(deviceModel);
  }

}

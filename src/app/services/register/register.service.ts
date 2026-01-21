import { inject, Injectable } from '@angular/core';
import { RegisterDevice } from '../../interfaces/device/RegisterDevice';
import { Observable } from 'rxjs';
import { Device } from '../../interfaces/device/Device';
import { DevicesStateService } from '../state/devices/devices-state.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private state = inject(DevicesStateService);

  registerDevice(request: RegisterDevice): Observable<Device> {
    return this.state.registerDevice(request);
  }
}


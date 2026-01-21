import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AllDevices } from '../../interfaces/AllDevices';
import { HttpService } from '../backend/http.service';
import { RegisterDevice } from '../../interfaces/RegisterDevice';

@Injectable({
  providedIn: 'root'
})
export class DevicesStateService {

  private deviceSubject = new BehaviorSubject<AllDevices[]>([]);
  public device$ = this.deviceSubject.asObservable();
  private api = inject(HttpService);

  // Adiciona os dispositivos ao estado
  addDevicesToState() {
    return this.api.allDevices().pipe(
      tap((devices) => {
        this.deviceSubject.next(devices);
      })
    )
  }

  addDeviceToState(request: RegisterDevice) : Observable<AllDevices> {

    return this.api.register(request).pipe(
      tap((newDevice) => {

        //Pega o valor atual de todos os dispositivos
        const currentDevice = this.deviceSubject.getValue();

        //Adiciona o novo dispositivo ao array
        this.deviceSubject.next([newDevice, ...currentDevice]);
      })
    )
  }
}

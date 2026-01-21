import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, switchMap, map, catchError, of } from 'rxjs';
import { Device } from '../../../interfaces/device/Device';
import { RegisterDevice } from '../../../interfaces/device/RegisterDevice';
import { UpdateDevice } from '../../../interfaces/device/UpdateDevice';
import { HttpService } from '../../backend/http.service';
import { SensorsStateService } from '../sensors/sensors-state.service';

@Injectable({
  providedIn: 'root'
})
export class DevicesStateService {

  private api = inject(HttpService);

  private devicesSubject = new BehaviorSubject<Device[]>([]);
  public device$ = this.devicesSubject.asObservable();

  stateSensor = inject(SensorsStateService);

  getAllDevices(): Observable<Device[]> {
    return this.api.getAllDevices().pipe(
      tap((devices) => this.devicesSubject.next(devices))
    );
  }

  // Receber novo dispositivo e salvar na lista
  registerDevice(request: RegisterDevice): Observable<Device> {
    return this.api.register(request).pipe(
      tap((newDevice) => {

        const currentDevices = this.devicesSubject.value;
        this.devicesSubject.next([newDevice, ...currentDevices]);
      })
    );
  }


  updateDevice(deviceModel: string, request: UpdateDevice): Observable<Device> {

    return this.api.updateDevice(deviceModel, request).pipe(
      switchMap((responseDevice) => {
        const currentDevices = this.devicesSubject.value;
        this.devicesSubject.next(currentDevices.map(device => device.deviceModel === deviceModel ? responseDevice : device));

        return this.api.updateSensor(deviceModel, { name: request.newName, deviceModel: request.newDeviceModel, manufacturer: request.newManufacturer }).pipe(
          tap((responseSensor) => {
            const currentSensors = this.stateSensor.sensorsSubject.value;
            this.stateSensor.sensorsSubject.next(currentSensors.map(sensor => sensor.deviceModel === deviceModel ? responseSensor : sensor));
          }),
          switchMap(() =>
            this.api.updateAnalysis(deviceModel, {name: request.newName, deviceModel: request.newDeviceModel, manufacturer: request.newManufacturer, description: request.newDescription})
          ),
          map(() => responseDevice)
        );
      })
    )
  }

  deleteDevice(deviceModel:string): Observable<Device> {

    return this.api.deleteDevice(deviceModel).pipe(
      switchMap((responseDevice) => {

        const currentDevice = this.devicesSubject.value;
        this.devicesSubject.next(currentDevice.filter(device => device.deviceModel !== deviceModel));

        return this.api.deleteSensor(deviceModel).pipe(
          tap((responseSensor) => {

            const currentSensor = this.stateSensor.sensorsSubject.value;
            this.stateSensor.sensorsSubject.next(currentSensor.filter(sensor => sensor.deviceModel !== deviceModel))
          }),
          catchError(() => of(null)),
          switchMap(() =>
            this.api.deleteAnalysis(deviceModel).pipe(
              catchError(() => of(null))
            )
          ),
          map(() => responseDevice)
        );
      })
    )
  }

}

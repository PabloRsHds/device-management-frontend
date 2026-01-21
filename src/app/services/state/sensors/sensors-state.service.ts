import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Sensor } from '../../../interfaces/sensor/Sensor';
import { HttpService } from '../../backend/http.service';

@Injectable({
  providedIn: 'root'
})
export class SensorsStateService {

  private api = inject(HttpService)

  public sensorsSubject = new BehaviorSubject<Sensor[]>([])
  public sensors$ = this.sensorsSubject.asObservable()


  getAllSensorsActivated(): Observable<Sensor[]> {
    return this.api.getAllSensorsActivated().pipe(
      tap((sensors) => this.sensorsSubject.next(sensors))
    )
  }

  changeStatusSensor(deviceModel: string): Observable<Sensor> {
    return this.api.changeStatus(deviceModel).pipe(
      tap((updateSensor) => {
        // Pega o estado atual
        const currentDevices = this.sensorsSubject.value;
        // Atualiza o estado
        if (updateSensor.status == "ACTIVATED") {
          this.sensorsSubject.next(currentDevices.map(sensor => sensor.deviceModel === deviceModel ? updateSensor : sensor));
        } else {
          this.sensorsSubject.next(currentDevices.filter(sensor => sensor.deviceModel !== deviceModel));
        }
      })
    );
  }


}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterDevice } from '../../interfaces/device/RegisterDevice';
import { catchError, Observable, throwError } from 'rxjs';
import { Device } from '../../interfaces/device/Device';
import { Sensor } from '../../interfaces/sensor/Sensor';
import { DeviceAnalysisDto } from '../../interfaces/analysis/DeviceAnalysisDto';
import { Login } from '../../interfaces/login/Login';
import { Notification } from '../../interfaces/notification/Notification';
import { RequestTokens } from '../../interfaces/login/RequestTokens';
import { ResponseTokens } from '../../interfaces/login/ResponseTokens';
import { UpdateDevice } from '../../interfaces/device/UpdateDevice';
import { UpdateSensor } from '../../interfaces/sensor/UpdateSensor';
import { RequestUpdateDeviceAnalysis } from '../../interfaces/analysis/RequestUpdateDeviceAnalysis';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private http = inject(HttpClient);


  //DEVICE MANAGEMENT
  register(device: RegisterDevice): Observable<Device> {
    return this.http.post<Device>('http://localhost:8082/api/register-device', device);
  }

  //DEVICE MANAGEMENT
  updateDevice(deviceModel: string ,device: UpdateDevice): Observable<Device> {
    return this.http.patch<Device>(`http://localhost:8082/api/update-device/${deviceModel}`, device);
  }

  //DEVICE MANAGEMENT
  deleteDevice(deviceModel: string): Observable<Device> {
    return this.http.delete<Device>(`http://localhost:8082/api/delete-device/${deviceModel}`);
  }

  //TEST
  updateSensor(deviceModel: string, updateSensor: UpdateSensor): Observable<Sensor> {
    return this.http.patch<Sensor>(`http://localhost:8083/api/update-sensor/${deviceModel}`, updateSensor);
  }

  //TEST
  deleteSensor(deviceModel: string): Observable<Sensor> {
    return this.http.delete<Sensor>(`http://localhost:8083/api/delete-sensor/${deviceModel}`);
  }

  //TEST
  getAllSensorsActivated(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>('http://localhost:8083/api/find-all-sensors-activated');
  }

  //TEST
  getStatus(deviceModel: string): Observable<string> {
    return this.http.get<string>(`http://localhost:8083/api/get-status/${deviceModel}`, { responseType: 'text' as 'json' });
  }

  //TEST
  changeStatus(deviceModel: string): Observable<Sensor> {
    return this.http.patch<Sensor>(`http://localhost:8083/api/change-status/${deviceModel}`, deviceModel);
  }

  //DEVICE MANAGEMENT
  getAllDevices(): Observable<Device[]> {
    return this.http.get<Device[]>('http://localhost:8082/api/all-devices');
  }

  //DEVICE MANAGEMENT
  findDeviceWithDeviceModel(deviceModel: string): Observable<Device> {
    return this.http.get<Device>(`http://localhost:8082/api/find-by-device/${deviceModel}`);
  }

  //ANALYSIS
  getDeviceAnalysisForModel(deviceModel: string): Observable<DeviceAnalysisDto> {
    return this.http.get<DeviceAnalysisDto>('http://localhost:8084/api/get-device-for-model', { params: { deviceModel } });
  }

  //ANALYSIS
  updateAnalysis(deviceModel: string, request: RequestUpdateDeviceAnalysis): Observable<DeviceAnalysisDto> {
    return this.http.patch<DeviceAnalysisDto>(`http://localhost:8084/api/update-analysis/${deviceModel}`, request);
  }

  //ANALYSIS
  deleteAnalysis(deviceModel: string): Observable<DeviceAnalysisDto> {
    return this.http.delete<DeviceAnalysisDto>(`http://localhost:8084/api/delete-analysis/${deviceModel}`);
  }

  //LOGIN
  login(request:Login):Observable<ResponseTokens>{
    return this.http.post<ResponseTokens>('http://localhost:8081/api/login', request).pipe(

        catchError((err: HttpErrorResponse) => {
        let errorMsg = 'Serviço de login está temporiamente fora do ar';

        if (err.error && typeof err.error === 'object') {
          const keys = Object.keys(err.error);
          if (keys.length > 0) {
            errorMsg = err.error[keys[0]];
          }
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  // LOGIN
  refreshTokens(tokens: RequestTokens): Observable<ResponseTokens> {
    return this.http.post<ResponseTokens>('http://localhost:8081/api/refresh-token', tokens).pipe(

        catchError((err: HttpErrorResponse) => {
        let errorMsg = 'Não foi possivel criar novos tokens';

        if (err.error && typeof err.error === 'object') {
          const keys = Object.keys(err.error);
          if (keys.length > 0) {
            errorMsg = err.error[keys[0]];
          }
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  //NOTIFICAÇÃO
  notifications(page: number, size: number):Observable<Notification[]>{
    return this.http.get<Notification[]>(`http://localhost:8085/api/notifications?page=${page}&size=${size}`);
  }

  //NOTIFICAÇÃO
  visualization(): Observable<void> {
    return this.http.put<void>('http://localhost:8085/api/visualisation-notification', {});
  }

  //NOTIFICAÇÃO
  ocultNotification(notificationId : number): Observable<void> {
    return this.http.put<void>( `http://localhost:8085/api/occult-notification/${notificationId}`, {});
  }

  //NOTIFICAÇÃO
  countNotification(): Observable<number> {
    return this.http.get<number>('http://localhost:8085/api/count-notification');
  }
}

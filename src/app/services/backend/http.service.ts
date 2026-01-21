import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterDevice } from '../../interfaces/RegisterDevice';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AllDevices } from '../../interfaces/AllDevices';
import { AllSensors } from '../../interfaces/AllSensors';
import { DeviceAnalysisDto } from '../../interfaces/DeviceAnalysisDto';
import { Login } from '../../interfaces/Login';
import { Notifications } from '../../interfaces/Notifications';
import { RequestTokens } from '../../interfaces/RequestTokens';
import { ResponseTokens } from '../../interfaces/ResponseTokens';
import { UpdateDevice } from '../../interfaces/UpdateDevice';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private http = inject(HttpClient);

  //DEVICE MANAGEMENT
  register(device: RegisterDevice): Observable<AllDevices> {
    return this.http.post<AllDevices>('http://localhost:8082/api/register-device', device);
  }

  //DEVICE MANAGEMENT
  update(deviceModel: string ,device: UpdateDevice): Observable<AllDevices> {
    return this.http.patch<AllDevices>(`http://localhost:8082/api/update-device/${deviceModel}`, device);
  }

  //DEVICE MANAGEMENT
  delete(deviceModel: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:8082/api/delete-device/${deviceModel}`);
  }

  //TEST
  getAllSensorsActivated(): Observable<AllSensors[]> {
    return this.http.get<AllSensors[]>('http://localhost:8083/api/find-all-sensors-activated');
  }

  //TEST
  getStatus(deviceModel: string): Observable<string> {
    return this.http.get<string>(`http://localhost:8083/api/get-status/${deviceModel}`, { responseType: 'text' as 'json' });
  }

  //TEST
  changeStatus(deviceModel: string): Observable<void> {
    return this.http.patch<void>(`http://localhost:8083/api/change-status/${deviceModel}`, deviceModel);
  }

  //DEVICE MANAGEMENT
  allDevices(): Observable<AllDevices[]> {
    return this.http.get<AllDevices[]>('http://localhost:8082/api/all-devices');
  }

  //DEVICE MANAGEMENT
  findDeviceWithDeviceModel(deviceModel: string): Observable<AllDevices> {
    return this.http.get<AllDevices>(`http://localhost:8082/api/find-by-device/${deviceModel}`);
  }

  //ANALYSIS
  findDeviceModelForAnalysis(deviceModel: string): Observable<DeviceAnalysisDto> {
    return this.http.get<DeviceAnalysisDto>('http://localhost:8084/api/get-device-for-model', { params: { deviceModel } });
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
  notifications(page: number, size: number):Observable<Notifications[]>{
    return this.http.get<Notifications[]>(`http://localhost:8085/api/notifications?page=${page}&size=${size}`);
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

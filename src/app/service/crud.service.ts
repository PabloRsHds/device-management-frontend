import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RegisterDevice } from '../interfaces/RegisterDevice';
import { DeviceAnalysisDto } from '../interfaces/DeviceAnalysisDto';
import { UpdateDevice } from '../interfaces/UpdateDevice';
import { AllDevices } from '../interfaces/AllDevices';
import { AllSensors } from '../interfaces/AllSensors';
import { Login } from '../interfaces/Login';
import { ResponseTokens } from '../interfaces/ResponseTokens';
import { RequestTokens } from '../interfaces/RequestTokens';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) { }

  //DEVICE MANAGEMENT
  register(device: RegisterDevice): Observable<string> {
    return this.http.post<{ [key: string]: string }>('http://localhost:8082/api/register-device', device).pipe(
      map(response => {
        const firstKey = Object.keys(response)[0]; // Pega a primeira chave do objeto
        return response[firstKey]; // Retorna o valor da primeira chave
      }),
      catchError((err: HttpErrorResponse) => {
        let errorMsg:string; // Variável para armazenar o erro

        // err.error é um objeto: { "Bad request": "This cpf already cadastred" }
        if (err.error && typeof err.error === 'object') { // Se err.error for um objeto
          const keys = Object.keys(err.error); // Pega as chaves do objeto
          if (keys.length > 0) { // Se houver pelo menos uma chave
            errorMsg = err.error[keys[0]]; // <- pega "This cpf already cadastred"
          }
        }
        return throwError(() => new Error(errorMsg)); // Retorna o erro
      })
    );
  }

  //DEVICE MANAGEMENT
  update(deviceModel: string ,device: UpdateDevice): Observable<string> {
    return this.http.patch<{ [key: string]: string }>(`http://localhost:8082/api/update-device/${deviceModel}`, device).pipe(
      map(response => {
        const firstKey = Object.keys(response)[0]; // Pega a primeira chave do objeto
        return response[firstKey]; // Retorna o valor da primeira chave
      }),
      catchError((err: HttpErrorResponse) => {
        let errorMsg = 'Erro ao atualizar dispositivo';

        if (err.error) {
          if (typeof err.error === 'string') {
            errorMsg = err.error;
          } else if (typeof err.error === 'object') {
            const keys = Object.keys(err.error);
            if (keys.length > 0) {
              errorMsg = err.error[keys[0]];
            }
          }
        } else if (err.status === 404) {
          errorMsg = 'Device não encontrado';
        }

        return throwError(() => new Error(errorMsg));
      })
    );
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
}

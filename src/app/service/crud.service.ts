import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RegisterDevice } from '../interfaces/RegisterDevice';
import { DeviceAnalysisDto } from '../interfaces/DeviceAnalysisDto';
import { UpdateDevice } from '../interfaces/UpdateDevice';
import { AllDevices } from '../interfaces/AllDevices';
import { AllSensors } from '../interfaces/AllSensors';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) { }

  // Método para registrar um dispositivo
  register(device: RegisterDevice): Observable<string> {
    return this.http.post<{ [key: string]: string }>('http://localhost:8080/api/register-device', device).pipe(
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

  // Método para registrar um dispositivo
  update(deviceModel: string ,device: UpdateDevice): Observable<string> {
    return this.http.patch<{ [key: string]: string }>(`http://localhost:8080/api/update-device/${deviceModel}`, device).pipe(
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

  delete(deviceModel: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/delete-device/${deviceModel}`);
  }

  getAllSensorsActivated(): Observable<AllSensors[]> {
    return this.http.get<AllSensors[]>('http://localhost:8081/api/find-all-sensors-activated');
  }

  getStatus(deviceModel: string): Observable<string> {
    return this.http.get<string>(`http://localhost:8081/api/get-status/${deviceModel}`, { responseType: 'text' as 'json' });
  }

  changeStatus(deviceModel: string): Observable<void> {
    return this.http.patch<void>(`http://localhost:8081/api/change-status/${deviceModel}`, deviceModel);
  }

  allDevices(): Observable<AllDevices[]> {
    return this.http.get<AllDevices[]>('http://localhost:8080/api/all-devices');
  }

  findDeviceWithDeviceModel(deviceModel: string): Observable<AllDevices> {
    return this.http.get<AllDevices>(`http://localhost:8080/api/find-by-device/${deviceModel}`);
  }

  findDeviceModelForAnalysis(deviceModel: string): Observable<DeviceAnalysisDto> {
    return this.http.get<DeviceAnalysisDto>('http://localhost:8083/api/get-device-for-model', { params: { deviceModel } });
  }
}

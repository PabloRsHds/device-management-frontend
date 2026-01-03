import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RegisterDevice } from '../interfaces/RegisterDevice';
import { DeviceAnalysis } from '../interfaces/DeviceAnalysis';
import { DeviceAnalysisDto } from '../interfaces/DeviceAnalysisDto';

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

  allDevices(): Observable<RegisterDevice[]> {
    return this.http.get<RegisterDevice[]>('http://localhost:8080/api/all-devices');
  }

  allDevicesAnalysis(): Observable<DeviceAnalysisDto[]> {
    return this.http.get<DeviceAnalysisDto[]>('http://localhost:8083/api/get-all-analysis');
  }

  findDeviceModelForAnalysis(deviceModel: string): Observable<DeviceAnalysisDto> {
    return this.http.get<DeviceAnalysisDto>('http://localhost:8083/api/get-device-for-model', { params: { deviceModel } });
  }
}

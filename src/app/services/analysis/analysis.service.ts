import { inject, Injectable } from '@angular/core';
import { HttpService } from '../backend/http.service';
import { Observable } from 'rxjs';
import { DeviceAnalysisDto } from '../../interfaces/analysis/DeviceAnalysisDto';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  private api = inject(HttpService);

  getDeviceAnalysisForModel(deviceModel: string): Observable<DeviceAnalysisDto> {
    return this.api.getDeviceAnalysisForModel(deviceModel);
  }
}

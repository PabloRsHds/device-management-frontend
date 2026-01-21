import { inject, Injectable } from '@angular/core';
import { DevicesStateService } from '../states/devices-state.service';
import { AllDevices } from '../../interfaces/AllDevices';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  private state = inject(DevicesStateService)

  submitGetDevices() : Observable<AllDevices[]> {
    return this.state.addDevicesToState().pipe(
      tap(),
      catchError((error) => {
        console.error('Error registering device:', error);
        return throwError(() => error)
      } )
    );
  }

}

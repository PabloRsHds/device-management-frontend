import { inject, Injectable } from '@angular/core';
import { DevicesStateService } from '../states/devices-state.service';
import { RegisterDevice } from '../../interfaces/RegisterDevice';
import { AllDevices } from '../../interfaces/AllDevices';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private state = inject(DevicesStateService);

  submitRegistration(request: RegisterDevice) : Observable<AllDevices> {
    return this.state.addDeviceToState(request).pipe(
      tap(),
      catchError((error) => {
        console.error('Error registering device:', error);
        return throwError(() => error)
      } )
    );
  }
}

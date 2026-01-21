import { inject, Injectable } from '@angular/core';
import { HttpService } from '../backend/http.service';
import { Login } from '../../interfaces/login/Login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private api = inject(HttpService)

  login(request: Login) {
    return this.api.login(request);
  }

}

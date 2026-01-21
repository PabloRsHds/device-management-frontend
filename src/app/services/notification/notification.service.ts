import { inject, Injectable } from '@angular/core';
import { HttpService } from '../backend/http.service';
import { interval, startWith, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private api = inject(HttpService);

  // Contador
  pollCount() {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.api.countNotification())
    );
  }

  // lista paginada
  loadNotifications(page: number, size: number) {
    return this.api.notifications(page, size);
  }

  // marcar como visualizada
  visualize() {
    return this.api.visualization();
  }

  // ocultar notificação
  ocult(notificationId: number) {
    return this.api.ocultNotification(notificationId);
  }
}

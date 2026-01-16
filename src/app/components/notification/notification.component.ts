import { Component, inject } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { Notifications } from '../../interfaces/Notifications';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {

  //===============================================================

  loading = false;
  hasMore = true;

  countNotifications = 0;

  page = 0;
  size = 4;

  openModalNotifications = false;

  listNotifications: Notifications[] = [];

  service = inject(CrudService);


  ngOnInit(): void {
    this.countNotification();
  }

  visualization() {
    this.service.visualization().subscribe();
  }

  countNotification() {
    this.service.countNotification().subscribe(
      response => this.countNotifications = response
    );
  }

  ocultNotifications(notificationId : number) {
    this.service.ocultNotification(notificationId).subscribe({
      next: (response) => {
        this.reloadNotifications();
      }
    });
  }

  openNotifications() {
    this.openModalNotifications = !this.openModalNotifications;
    this.page = 0;
    this.listNotifications = [];
    this.countNotifications = 0;
    this.hasMore = true;

    this.loadMore();
  }

  reloadNotifications() {
    this.page = 0;
    this.listNotifications = [];
    this.hasMore = true;
    this.loading = false;

    this.loadMore();
  }

  loadMore() {
    if (this.loading || !this.hasMore) {
      return;
    }

    this.loading = true;

    this.service.notifications(this.page, this.size).subscribe({
      next: (response) => {

        if (response.length < this.size) {
          this.hasMore = false; // não tem mais dados
        }

        this.listNotifications.push(...response);
        this.visualization();
        this.page++;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }



  onScroll(event: Event) {
    const element = event.target as HTMLElement;

    const chegouNoFim =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 5;

    if (chegouNoFim) {
      this.loadMore();
    }
  }
}

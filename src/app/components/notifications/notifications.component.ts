import { Component, inject } from '@angular/core';
import { Notification } from '../../interfaces/notification/Notification';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

  //===============================================================

  loading = false;
  hasMore = true;

  countNotifications = 0;

  page = 0;
  size = 7;

  loadingNotifications = false;

  openModalNotifications = false;

  listNotifications: Notification[] = [];

  service = inject(NotificationService);


  ngOnInit(): void {
    this.countNotification();
  }

  visualization() {
    this.service.visualize().subscribe();
  }

  countNotification() {
    this.service.pollCount().subscribe(
      response => this.countNotifications = response
    );
  }

  ocultNotifications(notificationId : number) {
    this.service.ocult(notificationId).subscribe({
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

    this.service.loadNotifications(this.page, this.size).subscribe({
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

    // Calcula se chegou no final (80% do scroll)
    const scrollPosition = element.scrollTop;
    const totalHeight = element.scrollHeight;
    const visibleHeight = element.clientHeight;

    // Quando estiver a 20px do final
    if (totalHeight - (scrollPosition + visibleHeight) < 20) {
      if (!this.loading && this.hasMore) {
        this.loadMore();
      }
    }
  }
}

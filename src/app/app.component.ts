import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { NotificationService } from './services/notification.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  public showMenu: boolean = false;
  public loading: boolean = false;

  
  constructor(
    private spinnerService: SpinnerService, 
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    //Cargamos la configuración del spinner
    this.spinnerService.$loading.subscribe(loading => {
      this.loading = loading;
    });

    //Cargamos la configuración para las pushes
    await this.notificationService.init();
  }
}

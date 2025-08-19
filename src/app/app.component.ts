import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { NotificationService } from './services/notification.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Notificaciones', url: '/mobile/sources/notifications', icon: 'mail' },
    { title: 'Calendario', url: '/mobile/sources/calendar', icon: 'calendar' },
    { title: 'Fuentes de Datos', url: '/mobile/select-sources', icon: 'radio' },
    { title: 'Sobre Nosotros', url: '/mobile/select-sources', icon: 'information-circle' }
  ];

  public showMenu: boolean = true;
  public loading: boolean = false;
  closed$ = new Subject<any>();


  
  constructor(
    private spinnerService: SpinnerService, 
    private notificationService: NotificationService,
    private router: Router
  ) {}

  async ngOnInit() {
    //Cargamos la configuración del spinner
    this.spinnerService.$loading.subscribe(loading => {
      this.loading = loading;
    });

    //Cargamos el menu
    this.loadMenu(this.router.url);
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.closed$)
    ).subscribe((event: NavigationEnd) => {
      this.loadMenu(event.url);
    });

    // IMPORTANTE -> AL FINAL
    //Cargamos la configuración para las pushes 
    setTimeout(async () => {
      await this.notificationService.init();
    }, 2000);
  }

  ngOnDestroy() {
    this.closed$.unsubscribe();
  }

  // Lógica de validación en una función separada para evitar duplicación
  private loadMenu(url: string): void {
    this.showMenu = url.includes('sources');
  }
}

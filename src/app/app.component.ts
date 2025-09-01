import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { NotificationService } from './services/notification.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FirebaseService } from './services/firebase.service';
import { Browser } from '@capacitor/browser';
import { Preferences } from '@capacitor/preferences';
import { PreferenceConstants } from './utils/preferences.util';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  public appPages: any = [];

  public showMenu: boolean = true;
  public loading: boolean = false;
  mode: string = environment.mode;
  closed$ = new Subject<any>();



  constructor(
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    this.loadMenuPages();
  }

  async ngOnInit() {
    //Cargamos la configuración del spinner
    this.spinnerService.$loading.subscribe(loading => {
      this.loading = loading;
    });

    //Cargamos el menu
    this.showMenuIcon(this.router.url);
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.closed$)
    ).subscribe((event: NavigationEnd) => {
      this.showMenuIcon(event.url);
    });

    // IMPORTANTE -> AL FINAL
    //Cargamos la configuración para las pushes si estamos en modo app
    if (environment.mode === 'app') {
      setTimeout(async () => {
        await this.notificationService.init();
      }, 2000);
    }
  }

  ngOnDestroy() {
    this.closed$.unsubscribe();
  }

  async logout() {
    await this.firebaseService.logout();
    this.router.navigateByUrl('web/login');
  }

  openLink(link: string) {
    const url = link.startsWith('/') ? `${environment.baseFrontendUrl}${link}` : link;
    Browser.open({ url });
  }

  private async showMenuIcon(url: string) {
    if (environment.mode === 'app') {
      const hasSubscribedSources = (await Preferences.get({ key: PreferenceConstants.subscribedSources }))?.value != undefined;
      if(!hasSubscribedSources) {
        this.showMenu = false;
        return;
      }
    }

    if (environment.mode === 'app') {  
      this.showMenu = url.includes('sources');
    } else {
      this.showMenu = url.includes('web/my-events')
        || url.includes('web/my-calendar');
    }
  }

  private loadMenuPages() {
    if (environment.mode === 'app') {
      this.appPages = [
        { title: 'Notificaciones', url: '/mobile/sources/events', icon: 'mail' },
        //{ title: 'Calendario', url: '/mobile/sources/calendar', icon: 'calendar' },
        { title: 'Fuentes de Datos', url: '/mobile/select-sources', icon: 'radio' },
        //{ title: 'Sobre Nosotros', url: '/mobile/select-sources', icon: 'information-circle' }
      ];
    } else {
      this.appPages = [
        { title: 'Notificaciones', url: '/web/my-events', icon: 'mail' },
        //{ title: 'Calendario', url: '/web/my-calendar', icon: 'calendar' }
      ];
    }
  }

}

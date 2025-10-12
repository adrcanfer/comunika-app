import { Component, NgZone, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Preferences } from '@capacitor/preferences';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AdmobService } from './services/admob.service';
import { FirebaseService } from './services/firebase.service';
import { NotificationService } from './services/notification.service';
import { SpinnerService } from './services/spinner.service';
import { PreferenceConstants } from './utils/preferences.util';
import { AlertService } from './services/alert.service';

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
    private zone: NgZone,
    private firebaseService: FirebaseService,
    private admobService: AdmobService,
    private alertService: AlertService
  ) {
    this.loadMenuPages();
  }

  async ngOnInit() {
    //Cargamos la configuración de los anuncios
    this.admobService.initialize();

    //Cargamos la configuración de los applinks
    this.initAppLink();
    
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
        || url.includes('web/my-calendar')
        || url.includes('web/account');
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
        //{ title: 'Calendario', url: '/web/my-calendar', icon: 'calendar' },
        { title: 'Mi Cuenta', url: '/web/account', icon: 'person' }
      ];
    }
  }

  private initAppLink() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(async () => {
        const url = new URL(event.url);
        console.log(url);

        const path = url.pathname.replace("web", "mobile");
        this.router.navigateByUrl(path);
      });
    });
  }

}

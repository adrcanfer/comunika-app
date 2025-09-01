import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Event } from 'src/app/model/event.model';
import { AlertService } from 'src/app/services/alert.service';
import { EventService } from 'src/app/services/event.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  standalone: false
})
export class EventPage implements ViewWillEnter {

  event?: Event;
  ownerMode: boolean = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private eventService: EventService,
    private spinnerService: SpinnerService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    const eventId = this.activatedRoute.snapshot.paramMap.get('eventId')!;
    this.getEvent(eventId);
  
  }

  edit() {
    this.router.navigateByUrl(`/web/event-editor/${this.event!.id}`);
  }

  delete() {
    const title = 'Eliminar notificación';
    const description = `¿Desea eliminar la notificación '${this.event!.title}'?`;
    this.alertService.showDialog(title, description, () => {
      this.spinnerService.showSpinner();
      this.eventService.deleteEvent(this.event!.id!).then(() => {
        this.router.navigateByUrl(`/web/my-events`);
      })
      .catch((e) => {
        console.error(e);
        this.alertService.showAlert("Error", "Se ha producido un error eliminando la notificación. Inténtelo más tarde.")
      }).finally(() => this.spinnerService.closeSpinner());
    });
  }

  back() {
    if(this.ownerMode) {
      this.router.navigateByUrl("/web/my-events");
    } else {
      this.router.navigateByUrl(`/web/events/${this.event?.source?.id}`);
    }
  }

  private async getEvent(eventId: string) {
    this.spinnerService.showSpinner();
    const owner = await this.firebaseService.getLoggedUserId();
    this.eventService.getEvent(eventId, !owner)
      .then((e) => {
        this.event = e;
        this.ownerMode = owner != undefined && this.event.source?.id == owner;
      }).catch(e => {
        console.error(e);
        this.alertService.showAlert("Error", "Se ha producido un error recuperando la notificación. Inténtelo más tarde.")
      }).finally(() => this.spinnerService.closeSpinner());
  }

}

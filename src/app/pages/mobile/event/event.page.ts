import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { ViewWillEnter } from '@ionic/angular';
import { Event } from 'src/app/model/event.model';
import { AdmobService } from 'src/app/services/admob.service';
import { EventService } from 'src/app/services/event.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { getPlanDetail } from 'src/app/utils/plans';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
  standalone: false
})
export class EventPage implements ViewWillEnter {

  eventDetail?: Event;

  constructor(
    private eventService: EventService,
    private spinnerService: SpinnerService,
    private activedRouter: ActivatedRoute,
    private router: Router,
    private admobService: AdmobService
  ) { }

  ionViewWillEnter() {
    const eventId = this.activedRouter.snapshot.paramMap.get('eventId')
    console.log(eventId);

    if(eventId) {
      this.spinnerService.showSpinner();
      this.eventService.getEvent(eventId)
        .then(e => {
          this.eventDetail = e;
          const plan = getPlanDetail(this.eventDetail!.source!.plan!);
          this.admobService.isFreeAccount(plan.ads);
          this.admobService.showBanner(120);
          
        })
        .finally(() => this.spinnerService.closeSpinner());
    }
  }

  async share() {
    const url = `${environment.baseAppLinkUrl}/${environment.eventPath}/${this.eventDetail!.id!}`;

    await Share.share({
      text: `Mira la notificación '${this.eventDetail!.title}' de '${this.eventDetail!.source!.name}' en ComuniKame`,
      url
    });
  }

  back() {
    this.router.navigateByUrl(`/mobile/events/${this.eventDetail?.source?.id}`);
  }

}

import { Component } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { Account } from 'src/app/model/account.model';
import { AlertService } from 'src/app/services/alert.service';
import { SourceService } from 'src/app/services/source.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { getPlanDetail, PlanDetail } from 'src/app/utils/plans';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false
})
export class AccountPage implements ViewWillEnter {

  account?: Account;
  planDetail?: PlanDetail;
  subscriptorsProgress: number = 1;
  notificationsProgress: number = 1;

  constructor(
    private sourceService: SourceService,
    private spinnerService: SpinnerService,
    private alertService: AlertService
  ) { }

  ionViewWillEnter() {
    this.getAccount();
  }

  getSubscriptorsProgress() {
    if(this.planDetail!.subscriptions != 'Ilimitado') {
      this.subscriptorsProgress = this.account!.subscriptors / this.planDetail!.subscriptions!;
    }
  }

  getNotificationsProgress() {
    if(this.planDetail!.notifications != 'Ilimitado') {
      this.notificationsProgress = this.account!.events / this.planDetail!.notifications;
    }
  }

  private getAccount() {
    this.spinnerService.showSpinner();
    this.sourceService.getAccount()
      .then((account: Account) => {
        this.account = account;
        this.planDetail = getPlanDetail(this.account?.source.plan!);
        this.getNotificationsProgress();
        this.getSubscriptorsProgress();
      }).catch(err => {
        console.error(err);
        this.alertService.showAlert("Error", "Se ha producido un error recuperando la información. Inténtelo de nuevo más tarde");
      }).finally(() => this.spinnerService.closeSpinner());
  }

  

}

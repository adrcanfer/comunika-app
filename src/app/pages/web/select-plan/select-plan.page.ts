import { Location } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/app/model/account.model';
import { PaymentService } from 'src/app/services/payment.service';
import { SourceService } from 'src/app/services/source.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { PlanDetail, Plans } from 'src/app/utils/plans';

@Component({
  selector: 'app-select-plan',
  templateUrl: './select-plan.page.html',
  styleUrls: ['./select-plan.page.scss'],
  standalone: false
})
export class SelectPlanPage implements OnInit {

  plans: PlanDetail[] = Plans;
  account!: Account;
  selectedPlan!: string;

  constructor(
    private sourceService: SourceService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private spinnerService: SpinnerService,
    private paymentService: PaymentService
  ) { }

  async ngOnInit() {
    this.selectedPlan = this.activatedRoute.snapshot.paramMap.get('current-plan') ?? 'undefined';

    this.spinnerService.showSpinner();
    this.account = await this.sourceService.getAccount();
    this.spinnerService.closeSpinner();

  }

  selectPlan(p: PlanDetail) {

    if(this.selectedPlan != 'undefined') {
      //Si hay ya un plan, abrimos el portal session
      this.openPortalSession();
    } else {
      //Si no, abrimos la url para crear una nueva suscripción
      const url = p.paymentUrl! + this.account.source.email;
      window.open(url, '_self');
    }
  }

  openPortalSession() {
    this.spinnerService.showSpinner();
    this.paymentService.getPortalSessionUrl()
      .then((d) => window.open(d.sessionUrl, '_self'))
      .catch(e => console.error(e))
      .finally(() => this.spinnerService.closeSpinner());
  }

  back() {
    this.location.back();
  }

}

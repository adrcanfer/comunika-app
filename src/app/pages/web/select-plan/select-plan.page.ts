import { Location } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanDetail, Plans } from 'src/app/utils/plans';

@Component({
  selector: 'app-select-plan',
  templateUrl: './select-plan.page.html',
  styleUrls: ['./select-plan.page.scss'],
  standalone: false
})
export class SelectPlanPage implements OnInit {

  plans: PlanDetail[] = Object.values(Plans);
  selectedPlan!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit() {
    this.selectedPlan = this.activatedRoute.snapshot.paramMap.get('eventId') ?? 'Free';

  }

  selectPlan(p: PlanDetail) {
    console.log(p);
  }

  back() {
    this.location.back();
  }

}

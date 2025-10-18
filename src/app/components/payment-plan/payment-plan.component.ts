import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlanDetail } from 'src/app/utils/plans';

@Component({
  selector: 'app-payment-plan',
  templateUrl: './payment-plan.component.html',
  styleUrls: ['./payment-plan.component.scss'],
  standalone: false
})
export class PaymentPlanComponent  implements OnInit {

  @Input() plan!: PlanDetail;
  @Input() selected: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() update: boolean = false;
  @Output() doAction: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  performAction() {
    this.doAction.next();
  }

}

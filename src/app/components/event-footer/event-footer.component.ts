import { Component, Input, OnInit } from '@angular/core';
import { Event } from 'src/app/model/event.model';

@Component({
  selector: 'app-event-footer',
  templateUrl: './event-footer.component.html',
  styleUrls: ['./event-footer.component.scss'],
  standalone: false
})
export class EventFooterComponent  implements OnInit {

  @Input() event!: Event

  constructor() { }

  ngOnInit() {}

}

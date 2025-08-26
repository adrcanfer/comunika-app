import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-img-miniature',
  templateUrl: './img-miniature.component.html',
  styleUrls: ['./img-miniature.component.scss'],
  standalone: false
})
export class ImgMiniatureComponent  implements OnInit {

  @Input() src!: string;
  @Input() editMode: boolean = false;

  @Output() action: EventEmitter<string> = new EventEmitter<string>();



  constructor() { }

  ngOnInit() {}

  emitAction(action: string) {
    this.action.emit(action);
  }

}

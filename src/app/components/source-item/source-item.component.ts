import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Source } from 'src/app/model/source.model';

@Component({
  selector: 'app-source-item',
  templateUrl: './source-item.component.html',
  styleUrls: ['./source-item.component.scss'],
  standalone: false
})
export class SourceItemComponent {

  @Input() public source!: Source
  @Input() public selectable: boolean = true;
  @Output() updatedElement = new EventEmitter<Source>();

  constructor() { }

  onCheckboxChange() {
    if(!this.selectable) return;
    
    this.source.selected = !this.source.selected;
    this.updatedElement.next(this.source);
  }


}

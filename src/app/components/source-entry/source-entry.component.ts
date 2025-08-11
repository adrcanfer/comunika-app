import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Source } from 'src/app/model/source.model';

@Component({
  selector: 'app-source-entry',
  templateUrl: './source-entry.component.html',
  styleUrls: ['./source-entry.component.scss'],
  standalone: false
})
export class SourceEntryComponent {

  @Input() public source!: Source
  @Output() updatedElement = new EventEmitter<Source>();

  constructor() { }

  onCheckboxChange() {
    this.source.selected = !this.source.selected;
    this.updatedElement.next(this.source);
  }


}

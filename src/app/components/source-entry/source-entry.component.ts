import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Source } from 'src/app/model/source.model';

@Component({
  selector: 'app-source-entry',
  templateUrl: './source-entry.component.html',
  styleUrls: ['./source-entry.component.scss'],
  standalone: false
})
export class SourceEntryComponent  implements OnInit {

  @Input() source! : Source;
  @Input() action : string = 'notifications'

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  showDetail() {
    this.router.navigateByUrl(`/mobile/${this.action}/${this.source.id}`);
  }

}

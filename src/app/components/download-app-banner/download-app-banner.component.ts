import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-download-app-banner',
  templateUrl: './download-app-banner.component.html',
  styleUrls: ['./download-app-banner.component.scss'],
  standalone: false
})
export class DownloadAppBannerComponent  implements OnInit {

  @Input() sourceName: string = '';

  constructor() { }

  ngOnInit() {}

}

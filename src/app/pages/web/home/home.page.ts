import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements ViewWillEnter {

  showHeader: boolean = false;

  @ViewChild('firstContainer', { read: ElementRef }) firstContainer!: ElementRef;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  async ionViewWillEnter() {
    const loogedUser = await this.firebaseService.getLoggedUser();

    if(loogedUser) {
      this.router.navigateByUrl("/web/my-events");
    }
  }

  login() {
    this.router.navigateByUrl("web/login");
  }

  signup(plan: string) {
    this.router.navigate(['web/signup'], { queryParams: { plan: plan } });
  }

  onScroll(event: any) {
    this.checkTitleVisibility();
  }

  checkTitleVisibility() {
    if (this.firstContainer) {
      const firstContainerBottom = this.firstContainer.nativeElement.getBoundingClientRect().bottom;
      this.showHeader = firstContainerBottom <= 56
    }
  }

}

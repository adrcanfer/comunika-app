import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  count: number = 0;
  $loading:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  showSpinner() {
    this.count++;
    this.$loading.next(this.count > 0);
  }

  closeSpinner() {
    if(this.count > 0) {
      this.count--;
    }
    
    this.$loading.next(this.count > 0);
  }
}

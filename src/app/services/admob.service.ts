import { Injectable } from '@angular/core';
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';
import { isPlatform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdmobService {

  private isInitialized: boolean = false;
  private canShow: boolean = false;

  private footerOpts: BannerAdOptions = {
    adId: isPlatform('ios') ? 'ca-app-pub-1989701015038681/1306819831' : 'ca-app-pub-1989701015038681/8826217207',
    adSize: BannerAdSize.BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    isTesting: !environment.production
  }

  constructor() { }

  async initialize() {
    if(!this.isInitialized) {
      await AdMob.initialize({
        initializeForTesting: !environment.production
      });

      this.isInitialized = true;
    }
  }

  async isFreeAccount(showAdds: boolean) {
    this.canShow = showAdds;
  }

  async showBanner(margin: number = 0) {
    if(this.canShow) {
      await this.removeBanner();
      
      this.footerOpts.margin = margin;    
      await AdMob.showBanner(this.footerOpts);
    }
  }

  async removeBanner() {
    if(this.canShow) {
      await AdMob.removeBanner();
    }
  }

  async resumeBanner() {
    await AdMob.showBanner(this.footerOpts);  
    this.canShow = false;
  }
}

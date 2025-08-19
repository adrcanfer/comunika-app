import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { PreferenceConstants } from '../utils/preferences.util';

export const platformLayoutGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const platform = inject(Platform);
  const router = inject(Router);

  const currentUrl = state.url;
  const isMobile = platform.is('mobile')

  if (isMobile && !currentUrl.includes('mobile')) {
    router.navigateByUrl('mobile/home');
    return false;
  } else if(!isMobile && !currentUrl.includes('web')) {
    router.navigateByUrl('web/home');
    return false;
  } 

  const hasSubscribedSources = (await Preferences.get({key: PreferenceConstants.subscribedSources}))?.value != undefined;
  if(!hasSubscribedSources && !currentUrl.includes('home')) {
    router.navigateByUrl('/mobile/home');
    return false;
  } 

  return true;
};

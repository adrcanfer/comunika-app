import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import { PreferenceConstants } from '../utils/preferences.util';

export const platformLayoutGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);

  const currentUrl = state.url;
  const isMobile = environment.mode === 'app';

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

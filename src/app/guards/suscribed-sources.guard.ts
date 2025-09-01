import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import { PreferenceConstants } from '../utils/preferences.util';

export const suscribedSourcesGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);

  const currentUrl = state.url;
  const hasSubscribedSources = (await Preferences.get({ key: PreferenceConstants.subscribedSources }))?.value != undefined;
  if (!hasSubscribedSources && !currentUrl.includes('home')) {
    router.navigateByUrl('/mobile/home');
    return false;
  }

  return true;
};

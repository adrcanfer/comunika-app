import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Platform } from '@ionic/angular';

export const platformLayoutGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const platform = inject(Platform);
  const router = inject(Router);

  const currentUrl = state.url;
  const isMobile = true; //platform.is('mobile')

  if (isMobile && !currentUrl.includes('mobile')) {
    router.navigateByUrl('mobile/home');
  } else if(!isMobile && !currentUrl.includes('web')) {
    router.navigateByUrl('web/home');
  } 

  return true;
};

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';

export const platformLayoutGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);

  const currentUrl = state.url;
  const isMobile = environment.mode === 'app';

  //Si es mobile redirihimos a mobile y si no a web
  if (isMobile && !currentUrl.includes('mobile')) {
    router.navigateByUrl('mobile/home');
    return false;
  } else if(!isMobile && !currentUrl.includes('web')) {
    router.navigateByUrl('web/home');
    return false;
  }

  return true;
};

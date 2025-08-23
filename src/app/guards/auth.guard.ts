import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const firebaseService = inject(FirebaseService);

  const loogedUser = await firebaseService.getLoggedUser()

    if(!loogedUser) {
      router.navigateByUrl("/web/login");
      return false;
    } else {
      return true;
    }
};

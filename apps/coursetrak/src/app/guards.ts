import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from './services/supabase.service';

export const authGuardFn: CanActivateFn = async (
  next: ActivatedRouteSnapshot
) => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  if (await supabase.isLoggedIn()) {
    console.log();
    return true;
  }

  return router.createUrlTree(['/auth']);
};

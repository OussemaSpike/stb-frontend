import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { RoleRedirectService } from '../role-redirect.service';

export const roleRedirectGuard: CanActivateFn = (route, state) => {
    const roleRedirectService = inject(RoleRedirectService);
    const router = inject(Router);

    return roleRedirectService.getDefaultRoute().pipe(
        map((defaultRoute) => {
            // If we're already at the root or signed-in-redirect, redirect to role-based route
            if (state.url === '/' || state.url === '/signed-in-redirect') {
                router.navigateByUrl(defaultRoute);
                return false;
            }
            return true;
        })
    );
};

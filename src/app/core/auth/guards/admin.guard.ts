import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { RoleRedirectService } from '../role-redirect.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const roleRedirectService = inject(RoleRedirectService);
    const router = inject(Router);

    return roleRedirectService.isAdmin().pipe(
        map((isAdmin) => {
            if (!isAdmin) {
                // If not admin, redirect to client dashboard
                router.navigateByUrl('/client');
                return false;
            }
            return true;
        })
    );
};

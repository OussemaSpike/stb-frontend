import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { RoleRedirectService } from '../role-redirect.service';

export const clientGuard: CanActivateFn = (route, state) => {
    const roleRedirectService = inject(RoleRedirectService);
    const router = inject(Router);

    return roleRedirectService.isClient().pipe(
        map((isClient) => {
            if (!isClient) {
                // If not client, redirect to admin dashboard
                router.navigateByUrl('/clients');
                return false;
            }
            return true;
        })
    );
};

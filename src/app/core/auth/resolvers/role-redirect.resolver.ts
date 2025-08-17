import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { RoleRedirectService } from '../role-redirect.service';

export const roleRedirectResolver: ResolveFn<boolean> = (route, state) => {
    const roleRedirectService = inject(RoleRedirectService);
    const router = inject(Router);

    return roleRedirectService.getDefaultRoute().pipe(
        tap((defaultRoute) => {
            // Redirect to the appropriate dashboard based on user role
            router.navigateByUrl(defaultRoute);
        }),
        map(() => true)
    );
};

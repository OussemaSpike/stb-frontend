import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RoleRedirectService {
    private readonly userService = inject(UserService);
    private readonly router = inject(Router);

    /**
     * Get the default route for a user based on their role
     */
    getDefaultRoute(): Observable<string> {
        return this.userService.user$.pipe(
            map((user) => {
                if (!user) {
                    return '/sign-in';
                }

                // Check if user has ADMIN role
                if (user.roles.includes('ADMIN')) {
                    return '/admin/clients';
                }

                // Check if user has CLIENT role
                if (user.roles.includes('CLIENT')) {
                    return '/client/dashboard';
                }

                // Default fallback
                return '/client/dashboard';
            })
        );
    }

    /**
     * Redirect user to their default dashboard based on role
     */
    redirectToRoleDashboard(): void {
        this.getDefaultRoute().subscribe((route) => {
            this.router.navigateByUrl(route);
        });
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: string): Observable<boolean> {
        return this.userService.user$.pipe(
            map((user) => user?.roles.includes(role) ?? false)
        );
    }

    /**
     * Check if user is admin
     */
    isAdmin(): Observable<boolean> {
        return this.hasRole('ADMIN');
    }

    /**
     * Check if user is client
     */
    isClient(): Observable<boolean> {
        return this.hasRole('CLIENT');
    }
}

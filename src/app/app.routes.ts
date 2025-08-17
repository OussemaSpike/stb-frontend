import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { RoleRedirectComponent } from 'app/core/auth/components/role-redirect.component';
import { adminGuard } from 'app/core/auth/guards/admin.guard';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { clientGuard } from 'app/core/auth/guards/client.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to role-based dashboard
    {
        path: '',
        pathMatch: 'full',
        canActivate: [AuthGuard],
        component: RoleRedirectComponent,
    },

    // Redirect signed-in user to role-based dashboard
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location based on their role.
    {
        path: 'signed-in-redirect',
        pathMatch: 'full',
        canActivate: [AuthGuard],
        component: RoleRedirectComponent,
    },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'set-password',
                loadChildren: () =>
                    import('app/modules/auth/set-password/set-password.routes'),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.routes'),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.routes'),
            },
        ],
    },

    // Admin routes
    {
        path: 'admin',
        canActivate: [AuthGuard, adminGuard],
        canActivateChild: [AuthGuard, adminGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('app/modules/admin/dashboard/dashboard.routes'),
            },
            {
                path: 'clients',
                loadChildren: () =>
                    import('app/modules/admin/clients/clients.routes'),
            },
            {
                path: 'transfers',
                loadChildren: () =>
                    import('app/modules/admin/transfers/transfers.routes'),
            },
        ],
    },

    // Client routes
    {
        path: '',
        canActivate: [AuthGuard, clientGuard],
        canActivateChild: [AuthGuard, clientGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [
            {
                path: 'client',
                loadChildren: () => import('app/modules/client/client.routes'),
            },
        ],
    },
];

import { Component, OnInit, inject } from '@angular/core';
import { RoleRedirectService } from 'app/core/auth/role-redirect.service';

@Component({
    selector: 'app-role-redirect',
    template: `
        <div class="flex min-h-screen items-center justify-center">
            <div class="text-center">
                <div
                    class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"
                ></div>
                <p class="text-gray-600">Redirection en cours...</p>
            </div>
        </div>
    `,
    styles: [
        `
            .animate-spin {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
        `,
    ],
})
export class RoleRedirectComponent implements OnInit {
    private readonly roleRedirectService = inject(RoleRedirectService);

    ngOnInit(): void {
        this.roleRedirectService.redirectToRoleDashboard();
    }
}

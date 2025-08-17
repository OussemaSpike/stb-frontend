import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { UserService } from 'app/core/user/user.service';
import {
    BANK_ACCOUNT_TYPE_OPTIONS,
    BankAccountType,
    User,
} from 'app/core/user/user.types';

import { catchError, finalize, of } from 'rxjs';
import { getBranchNameFromCode } from '../branches';

@Component({
    selector: 'app-client-details',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatChipsModule,
        RouterModule,
    ],
    templateUrl: './client-details.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetailsComponent implements OnInit {
    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _destroyRef = inject(DestroyRef);
    private readonly _userService = inject(UserService);
    private readonly _route = inject(ActivatedRoute);
    private readonly _router = inject(Router);

    // -----------------------------------------------------------------------------------------------------
    // @ Observables and signals
    // -----------------------------------------------------------------------------------------------------

    readonly client = signal<User | null>(null);
    readonly isLoading = signal(false);
    readonly error = signal<string | null>(null);

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        const clientId = this._route.snapshot.paramMap.get('id');
        if (clientId) {
            this.loadClientDetails(clientId);
        } else {
            this._router.navigate(['/admin/clients']);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    loadClientDetails(id: string): void {
        this.isLoading.set(true);
        this.error.set(null);

        this._userService
            .getUserDetails(id)
            .pipe(
                catchError((error) => {
                    this.error.set(
                        'Erreur lors du chargement des détails du client'
                    );
                    return of(null);
                }),
                finalize(() => this.isLoading.set(false)),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe((client) => {
                this.client.set(client);
            });
    }

    goBack(): void {
        this._router.navigate(['/admin/clients']);
    }

    formatAccountType(
        accountType: BankAccountType | string | null | undefined
    ): string {
        if (!accountType) {
            return 'Non spécifié';
        }

        const option = BANK_ACCOUNT_TYPE_OPTIONS.find(
            (opt) => opt.key === accountType
        );
        return option?.displayName || accountType.toString();
    }

    getBranchName(rib: string | null | undefined): string {
        if (!rib) {
            return 'Non spécifié';
        }
        return getBranchNameFromCode(rib);
    }

    formatCurrency(amount: string | number | null | undefined): string {
        if (!amount) {
            return '0 TND';
        }

        const numericAmount =
            typeof amount === 'string' ? parseFloat(amount) : amount;
        return `${numericAmount.toLocaleString('fr-FR', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
        })} TND`;
    }

    formatDate(dateString: string | null | undefined): string {
        if (!dateString) {
            return 'Non spécifié';
        }

        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
}

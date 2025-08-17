import { CurrencyPipe, DatePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { HotToastService } from '@ngxpert/hot-toast';

import { filter, switchMap } from 'rxjs';

import { TransferService } from '../transfer.service';
import {
    Transfer,
    TRANSFER_STATUS_OPTIONS,
    TransferStatus,
} from '../transfer.types';

@Component({
    selector: 'app-transfer-details',
    imports: [
        RouterModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        DatePipe,
        CurrencyPipe,
    ],
    templateUrl: './transfer-details.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferDetailsComponent implements OnInit {
    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _activatedRoute = inject(ActivatedRoute);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _transferService = inject(TransferService);
    private readonly _fuseConfirmationService = inject(FuseConfirmationService);
    private readonly _toastService = inject(HotToastService);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly transfer = signal<Transfer | null>(null);
    readonly isLoading = signal(false);
    readonly isProcessing = signal(false);
    readonly showValidationForm = signal(false);
    readonly showRejectionForm = signal(false);
    readonly transferStatusOptions = TRANSFER_STATUS_OPTIONS;
    readonly TransferStatus = TransferStatus;

    // Validation form
    validationForm = new FormGroup({
        comment: new FormControl('', [Validators.maxLength(500)]),
        adminNotes: new FormControl('', [Validators.maxLength(1000)]),
    });

    // Rejection form
    rejectionForm = new FormGroup({
        reason: new FormControl('', [
            Validators.required,
            Validators.minLength(10),
        ]),
        additionalNotes: new FormControl('', [Validators.maxLength(1000)]),
    });

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        const transferId = this._activatedRoute.snapshot.params['id'];
        if (transferId) {
            this.loadTransferDetails(transferId);
        } else {
            this._router.navigate(['/transfers']);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    loadTransferDetails(transferId: string): void {
        this.isLoading.set(true);

        this._transferService
            .getTransferById(transferId)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (transfer) => {
                    this.transfer.set(transfer);
                    this.isLoading.set(false);
                },
                error: (error) => {
                    console.error('Error loading transfer details:', error);
                    this._toastService.error(
                        'Erreur lors du chargement des détails du virement'
                    );
                    this.isLoading.set(false);
                    this._router.navigate(['/transfers']);
                },
            });
    }

    goBack(): void {
        this._router.navigate(['/transfers']);
    }

    showValidation(): void {
        this.showValidationForm.set(true);
        this.showRejectionForm.set(false);
        this.validationForm.reset();
    }

    showRejection(): void {
        this.showRejectionForm.set(true);
        this.showValidationForm.set(false);
        this.rejectionForm.reset();
    }

    cancelAction(): void {
        this.showValidationForm.set(false);
        this.showRejectionForm.set(false);
        this.validationForm.reset();
        this.rejectionForm.reset();
    }

    submitValidation(): void {
        const transfer = this.transfer();
        if (!transfer || this.validationForm.invalid || this.isProcessing())
            return;

        const formValue = this.validationForm.value;

        const dialogRef = this._fuseConfirmationService.open({
            title: 'Confirmer la validation',
            message: `Êtes-vous sûr de vouloir valider ce virement de ${transfer.amount} ${transfer.currency} vers ${transfer.beneficiaryName} ?`,
            actions: {
                confirm: {
                    label: 'Valider',
                    color: 'primary',
                },
                cancel: {
                    label: 'Annuler',
                },
            },
            dismissible: true,
        });

        dialogRef
            .afterClosed()
            .pipe(
                filter((result) => result === 'confirmed'),
                switchMap(() => {
                    this.isProcessing.set(true);
                    return this._transferService
                        .approveTransfer({
                            transferId: transfer.id,
                            comment: formValue.comment || undefined,
                        })
                        .pipe(
                            this._toastService.observe({
                                loading: 'Validation du virement en cours...',
                                success: () => 'Virement validé avec succès.',
                                error: 'Erreur lors de la validation du virement.',
                            }),
                            takeUntilDestroyed(this._destroyRef)
                        );
                })
            )
            .subscribe({
                next: (updatedTransfer) => {
                    this.transfer.set(updatedTransfer);
                    this.isProcessing.set(false);
                    this.cancelAction();
                },
                error: () => {
                    this.isProcessing.set(false);
                },
            });
    }

    submitRejection(): void {
        const transfer = this.transfer();
        if (!transfer || this.rejectionForm.invalid || this.isProcessing())
            return;

        const formValue = this.rejectionForm.value;

        const dialogRef = this._fuseConfirmationService.open({
            title: 'Confirmer le rejet',
            message: 'Êtes-vous sûr de vouloir rejeter ce virement ?',
            actions: {
                confirm: {
                    label: 'Rejeter',
                    color: 'warn',
                },
                cancel: {
                    label: 'Annuler',
                },
            },
            dismissible: true,
        });

        dialogRef
            .afterClosed()
            .pipe(
                filter((result) => result === 'confirmed'),
                switchMap(() => {
                    this.isProcessing.set(true);
                    return this._transferService
                        .rejectTransfer({
                            transferId: transfer.id,
                            reason: formValue.reason!,
                        })
                        .pipe(
                            this._toastService.observe({
                                loading: 'Rejet du virement en cours...',
                                success: () => 'Virement rejeté avec succès.',
                                error: 'Erreur lors du rejet du virement.',
                            }),
                            takeUntilDestroyed(this._destroyRef)
                        );
                })
            )
            .subscribe({
                next: (updatedTransfer) => {
                    this.transfer.set(updatedTransfer);
                    this.isProcessing.set(false);
                    this.cancelAction();
                },
                error: () => {
                    this.isProcessing.set(false);
                },
            });
    }

    approveTransfer(): void {
        this.showValidation();
    }

    rejectTransfer(): void {
        this.showRejection();
    }

    getStatusInfo(status: TransferStatus) {
        return (
            this.transferStatusOptions.find(
                (option) => option.key === status
            ) || { displayName: status, color: 'gray' }
        );
    }
}

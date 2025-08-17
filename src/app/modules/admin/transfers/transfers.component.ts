import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { HotToastService } from '@ngxpert/hot-toast';

import { PageRequest, SortDirectionEnum } from 'app/shared/models';

import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

import { TransferService } from './transfer.service';
import {
    Transfer,
    TRANSFER_STATUS_OPTIONS,
    TransferSearchParams,
    TransferStatus,
} from './transfer.types';

@Component({
    selector: 'app-transfers-management',
    standalone: true,
    imports: [
        MatSidenavModule,
        MatTableModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatSortModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatSelectModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MtxGridModule,
        RouterModule,
    ],
    templateUrl: './transfers.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfersComponent implements OnInit {
    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _destroyRef = inject(DestroyRef);
    private readonly _transferService = inject(TransferService);
    private readonly _fuseConfirmationService = inject(FuseConfirmationService);
    private readonly _toastService = inject(HotToastService);
    private readonly _matDialog = inject(MatDialog);
    private readonly _router = inject(Router);

    // -----------------------------------------------------------------------------------------------------
    // @ Observables and signals
    // -----------------------------------------------------------------------------------------------------
    readonly columns = signal<MtxGridColumn[]>([]);
    readonly transfers = signal<Transfer[]>([]);
    readonly totalElements = signal(0);
    readonly pageSizeOptions = signal([5, 10, 25, 50]);
    readonly isLoading = signal(false);
    readonly isDisabled = signal(false);
    readonly transferStatusOptions = signal(TRANSFER_STATUS_OPTIONS);

    searchInputControl = new FormControl('');
    statusFilterControl = new FormControl('');
    beneficiaryFilterControl = new FormControl('');
    minAmountFilterControl = new FormControl<number | null>(null);
    maxAmountFilterControl = new FormControl<number | null>(null);
    startDateFilterControl = new FormControl<Date | null>(null);
    endDateFilterControl = new FormControl<Date | null>(null);

    readonly pageRequest = signal<PageRequest>({
        page: 0,
        size: 10,
        sort: 'createdAt',
        search: '',
        sortDirection: SortDirectionEnum.DESC,
    });

    readonly searchParams = signal<TransferSearchParams>({});

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.initializeColumns();

        this.isLoading.set(true);
        this.fetchPage();

        // Setup search input subscription
        this.searchInputControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe((query) => {
                this.isLoading.set(true);
                this.pageRequest.update((req) => ({
                    ...req,
                    search: query || '',
                    page: 0,
                }));
                this.fetchPage();
            });

        // Setup filter subscriptions
        this.setupFilterSubscriptions();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    fetchPage() {
        this._transferService
            .getAllTransfers(this.pageRequest(), this.searchParams())
            .subscribe({
                next: (data) => {
                    this.transfers.set(data.content || []);
                    this.totalElements.set(data.totalElements || 0);
                    this.isLoading.set(false);
                },
                error: () => {
                    this.isLoading.set(false);
                    this._toastService.error(
                        'Erreur lors du chargement des virements'
                    );
                },
            });
    }

    onSortChange(sort: Sort) {
        this.pageRequest.update((req) => ({
            ...req,
            sort: sort.active,
            sortDirection:
                sort.direction === 'asc'
                    ? SortDirectionEnum.ASC
                    : SortDirectionEnum.DESC,
        }));
        this.fetchPage();
    }

    onPageEvent(event: PageEvent) {
        this.pageRequest.update((req) => ({
            ...req,
            page: event.pageIndex,
            size: event.pageSize,
        }));
        this.fetchPage();
    }

    onViewTransferDetails(transfer: Transfer) {
        this._router.navigate(['/admin/transfers/details', transfer.id]);
    }

    onApproveTransfer(transfer: Transfer) {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Approuver le virement',
            message: `Êtes-vous sûr de vouloir approuver ce virement de ${transfer.amount} ${transfer.currency} vers ${transfer.beneficiaryName} ?`,
            actions: {
                confirm: {
                    label: 'Approuver',
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
                switchMap(() =>
                    this._transferService
                        .approveTransfer({ transferId: transfer.id })
                        .pipe(
                            this._toastService.observe({
                                loading: 'Approbation du virement...',
                                success: () => {
                                    this.fetchPage();
                                    return 'Virement approuvé avec succès.';
                                },
                                error: "Erreur lors de l'approbation du virement.",
                            }),
                            takeUntilDestroyed(this._destroyRef)
                        )
                )
            )
            .subscribe();
    }

    onRejectTransfer(transfer: Transfer) {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Rejeter le virement',
            message: `Pourquoi voulez-vous rejeter ce virement ?`,
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
                switchMap(() =>
                    this._transferService
                        .rejectTransfer({
                            transferId: transfer.id,
                            reason: "Rejeté par l'administrateur",
                        })
                        .pipe(
                            this._toastService.observe({
                                loading: 'Rejet du virement...',
                                success: () => {
                                    this.fetchPage();
                                    return 'Virement rejeté avec succès.';
                                },
                                error: 'Erreur lors du rejet du virement.',
                            }),
                            takeUntilDestroyed(this._destroyRef)
                        )
                )
            )
            .subscribe();
    }

    clearFilters() {
        this.statusFilterControl.reset();
        this.beneficiaryFilterControl.reset();
        this.minAmountFilterControl.reset();
        this.maxAmountFilterControl.reset();
        this.startDateFilterControl.reset();
        this.endDateFilterControl.reset();
        this.searchParams.set({});
        this.pageRequest.update((req) => ({ ...req, page: 0 }));
        this.fetchPage();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private setupFilterSubscriptions() {
        // Status filter
        this.statusFilterControl.valueChanges
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((status) => {
                this.searchParams.update((params) => ({
                    ...params,
                    status: (status as TransferStatus) || undefined,
                }));
                this.pageRequest.update((req) => ({ ...req, page: 0 }));
                this.fetchPage();
            });

        // Beneficiary filter
        this.beneficiaryFilterControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe((beneficiary) => {
                this.searchParams.update((params) => ({
                    ...params,
                    beneficiaryName: beneficiary || undefined,
                }));
                this.pageRequest.update((req) => ({ ...req, page: 0 }));
                this.fetchPage();
            });

        // Amount filters
        this.minAmountFilterControl.valueChanges
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe((amount) => {
                this.searchParams.update((params) => ({
                    ...params,
                    minAmount: amount || undefined,
                }));
                this.pageRequest.update((req) => ({ ...req, page: 0 }));
                this.fetchPage();
            });

        this.maxAmountFilterControl.valueChanges
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe((amount) => {
                this.searchParams.update((params) => ({
                    ...params,
                    maxAmount: amount || undefined,
                }));
                this.pageRequest.update((req) => ({ ...req, page: 0 }));
                this.fetchPage();
            });

        // Date filters
        this.startDateFilterControl.valueChanges
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((date) => {
                const formattedDate = date
                    ? date.toISOString().split('T')[0]
                    : undefined;
                this.searchParams.update((params) => ({
                    ...params,
                    startDate: formattedDate,
                }));
                this.pageRequest.update((req) => ({ ...req, page: 0 }));
                this.fetchPage();
            });

        this.endDateFilterControl.valueChanges
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((date) => {
                const formattedDate = date
                    ? date.toISOString().split('T')[0]
                    : undefined;
                this.searchParams.update((params) => ({
                    ...params,
                    endDate: formattedDate,
                }));
                this.pageRequest.update((req) => ({ ...req, page: 0 }));
                this.fetchPage();
            });
    }

    private initializeColumns(): void {
        this.columns.set([
            {
                header: 'Référence',
                field: 'reference',
                sortable: true,
            },
            {
                header: 'Bénéficiaire',
                field: 'beneficiaryName',
                sortable: true,
            },
            {
                header: 'RIB Bénéficiaire',
                field: 'beneficiaryRib',
            },
            {
                header: 'Montant',
                field: 'amount',
                type: 'currency',
                sortable: true,
                formatter: (data: Transfer) =>
                    `${data.amount} ${data.currency}`,
            },
            {
                header: 'Frais',
                field: 'fees',
                type: 'currency',
                formatter: (data: Transfer) => `${data.fees} ${data.currency}`,
            },
            {
                header: 'Montant Total',
                field: 'totalAmount',
                type: 'currency',
                sortable: true,
                formatter: (data: Transfer) =>
                    `${data.totalAmount} ${data.currency}`,
            },
            {
                header: 'Statut',
                field: 'status',
                type: 'tag',
                tag: {
                    PENDING: { text: 'En attente', color: 'amber-100' },
                    COMPLETED: { text: 'Terminé', color: 'green-100' },
                    FAILED: { text: 'Échoué', color: 'red-100' },
                    CANCELLED: { text: 'Annulé', color: 'gray-100' },
                },
            },
            {
                header: 'Créé le',
                field: 'createdAt',
                type: 'date',
                sortable: true,
            },
            {
                header: 'Actions',
                field: 'operation',
                pinned: 'right',
                type: 'button',
                buttons: [
                    {
                        type: 'icon',
                        text: 'view',
                        svgIcon: 'feather:eye',
                        tooltip: 'Voir les détails',
                        color: 'primary',
                        click: (rowData) => this.onViewTransferDetails(rowData),
                    },
                    {
                        type: 'icon',
                        text: 'approve',
                        svgIcon: 'feather:check',
                        tooltip: 'Approuver',
                        color: 'primary',
                        iif: (rowData: Transfer) =>
                            rowData.status === TransferStatus.PENDING,
                        click: (rowData) => this.onApproveTransfer(rowData),
                    },
                    {
                        type: 'icon',
                        text: 'reject',
                        svgIcon: 'feather:x',
                        tooltip: 'Rejeter',
                        color: 'warn',
                        iif: (rowData: Transfer) =>
                            rowData.status === TransferStatus.PENDING,
                        click: (rowData) => this.onRejectTransfer(rowData),
                    },
                ],
            },
        ]);
    }

    getStatusDisplayName(status: TransferStatus): string {
        const option = TRANSFER_STATUS_OPTIONS.find(
            (opt) => opt.key === status
        );
        return option?.displayName || status;
    }

    getStatusColor(status: TransferStatus): string {
        const option = TRANSFER_STATUS_OPTIONS.find(
            (opt) => opt.key === status
        );
        return option?.color || 'gray';
    }
}

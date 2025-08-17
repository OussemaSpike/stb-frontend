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

import { UserService } from 'app/core/user/user.service';
import {
    BANK_ACCOUNT_TYPE_OPTIONS,
    BankAccountType,
    User,
} from 'app/core/user/user.types';
import { PageRequest, RoleEnum, SortDirectionEnum } from 'app/shared/models';

import {
    debounceTime,
    distinctUntilChanged,
    filter,
    finalize,
    switchMap,
} from 'rxjs';
import { getBranchNameFromCode } from './branches';
import { ClientFormComponent } from './client-form/client-form.component';

@Component({
    selector: 'app-clients-management',
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
        MatChipsModule,
        MtxGridModule,
        RouterModule,
        MatSelectModule,
    ],
    templateUrl: './clients.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent implements OnInit {
    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _destroyRef = inject(DestroyRef);
    private readonly _clientService = inject(UserService);
    private readonly _fuseConfirmationService = inject(FuseConfirmationService);
    private readonly _toastService = inject(HotToastService);
    private readonly _matDialog = inject(MatDialog);
    private readonly _router = inject(Router);

    // -----------------------------------------------------------------------------------------------------
    // @ Observables and signals
    // -----------------------------------------------------------------------------------------------------
    readonly columns = signal<MtxGridColumn[]>([]);
    readonly clients = signal<User[]>([]);
    readonly totalElements = signal(0);
    readonly pageSizeOptions = signal([5, 10, 25, 50]);
    readonly isLoading = signal(false);
    readonly isDisabled = signal(false);

    searchInputControl = new FormControl('');
    readonly pageRequest = signal<PageRequest>({
        page: 0,
        size: 10,
        sort: 'createdAt',
        search: '',
        sortDirection: SortDirectionEnum.DESC,
    });

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
        this.searchInputControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                takeUntilDestroyed(this._destroyRef),
                finalize(() => this.isLoading.set(false))
            )
            .subscribe((query) => {
                this.isLoading.set(true);
                this.pageRequest().search = query;
                this.pageRequest().page = 0;
                this.fetchPage();
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    fetchPage() {
        this._clientService
            .getUsersByRole(RoleEnum.CLIENT, this.pageRequest())
            .subscribe((data) => {
                this.clients.set(data.content || []);
                this.totalElements.set(data.totalElements || 0);
                this.isLoading.set(false);
            });
    }

    onSortChange(sort: Sort) {
        this.pageRequest().sort = sort.active;
        this.pageRequest().sortDirection =
            sort.direction === 'asc'
                ? SortDirectionEnum.ASC
                : SortDirectionEnum.DESC;
        this.fetchPage();
    }

    onPageEvent(event: PageEvent) {
        this.pageRequest().page = event.pageIndex;
        this.pageRequest().size = event.pageSize;

        this.fetchPage();
    }

    openAddDialog() {
        const dialogRef = this._matDialog.open(ClientFormComponent, {
            data: {},
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'success') {
                this.fetchPage();
            }
        });
    }

    onUpdateClient(client: User) {
        const dialogRef = this._matDialog.open(ClientFormComponent, {
            data: {
                client,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'success') {
                this.fetchPage();
            }
        });
    }

    onViewClientDetails(client: User) {
        this._router.navigate(['/admin/clients/details', client.id]);
    }

    openConfirmationDialog(data: User): void {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Supprimer le client',
            message:
                'Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.',
            actions: {
                confirm: {
                    label: 'Supprimer',
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
                    this._clientService.deleteById(data.id).pipe(
                        this._toastService.observe({
                            loading: 'Suppression du client...',
                            success: () => {
                                this.fetchPage();
                                return 'Client supprimé avec succès.';
                            },
                        }),
                        takeUntilDestroyed(this._destroyRef)
                    )
                ),
                finalize(() => {
                    this.isDisabled.set(false);
                })
            )
            .subscribe();
    }

    enableClient(client: User): void {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Activer le client',
            message: `Êtes-vous sûr de vouloir activer le compte de ${client.fullName} ?`,
            actions: {
                confirm: {
                    label: 'Activer',
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
                    this._clientService.enableClient(client.id).pipe(
                        this._toastService.observe({
                            loading: 'Activation du client...',
                            success: () => {
                                this.fetchPage();
                                return 'Client activé avec succès.';
                            },
                            error: "Erreur lors de l'activation du client.",
                        }),
                        takeUntilDestroyed(this._destroyRef)
                    )
                ),
                finalize(() => {
                    this.isDisabled.set(false);
                })
            )
            .subscribe();
    }

    disableClient(client: User): void {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Désactiver le client',
            message: `Êtes-vous sûr de vouloir désactiver le compte de ${client.fullName} ? Le client ne pourra plus se connecter.`,
            actions: {
                confirm: {
                    label: 'Désactiver',
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
                    this._clientService.disableClient(client.id).pipe(
                        this._toastService.observe({
                            loading: 'Désactivation du client...',
                            success: () => {
                                this.fetchPage();
                                return 'Client désactivé avec succès.';
                            },
                            error: 'Erreur lors de la désactivation du client.',
                        }),
                        takeUntilDestroyed(this._destroyRef)
                    )
                ),
                finalize(() => {
                    this.isDisabled.set(false);
                })
            )
            .subscribe();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    private initializeColumns(): void {
        this.columns.set([
            {
                header: 'Nom complet',
                field: 'fullName',
                sortable: true,
            },
            {
                header: 'E-mail',
                field: 'email',
                sortable: true,
            },
            {
                header: 'CIN',
                field: 'cin',
                sortable: true,
            },
            {
                header: 'Numéro de téléphone',
                field: 'phoneNumber',
            },
            {
                header: 'Type de compte',
                field: 'bankAccount.accountType',
                formatter: (data: any) =>
                    this.formatAccountType(data.bankAccount?.accountType),
            },
            {
                header: 'RIB',
                field: 'bankAccount.rib',
            },
            {
                header: 'Agence',
                field: 'bankAccount.branchCode',
                formatter: (data: User) =>
                    getBranchNameFromCode(data.bankAccount?.rib),
            },
            {
                header: 'Statut',
                field: 'enabled',
                formatter: (data: User) => (data.enabled ? 'Actif' : 'Inactif'),
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
                        click: (rowData) => this.onViewClientDetails(rowData),
                    },
                    {
                        type: 'icon',
                        text: 'enable',
                        svgIcon: 'feather:check-circle',
                        tooltip: 'Activer le client',
                        color: 'primary',
                        click: (rowData) => this.enableClient(rowData),
                        iif: (rowData: User) => !rowData.enabled,
                    },
                    {
                        type: 'icon',
                        text: 'disable',
                        svgIcon: 'feather:x-circle',
                        tooltip: 'Désactiver le client',
                        color: 'warn',
                        click: (rowData) => this.disableClient(rowData),
                        iif: (rowData: User) => rowData.enabled,
                    },
                    {
                        type: 'icon',
                        text: 'delete',
                        svgIcon: 'feather:trash-2',
                        tooltip: 'Supprimer',
                        color: 'warn',
                        click: (rowData) =>
                            this.openConfirmationDialog(rowData),
                    },
                ],
            },
        ]);
    }

    formatAccountType(
        accountType: BankAccountType | string | null | undefined
    ): string {
        if (!accountType) {
            return '';
        }

        const option = BANK_ACCOUNT_TYPE_OPTIONS.find(
            (opt) => opt.key === accountType
        );
        return option?.displayName || accountType.toString();
    }
}

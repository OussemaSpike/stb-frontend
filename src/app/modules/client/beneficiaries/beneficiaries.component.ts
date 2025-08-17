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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { HotToastService } from '@ngxpert/hot-toast';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    finalize,
    switchMap,
} from 'rxjs';
import { BeneficiaryDto } from '../models/beneficiary.model';
import { BeneficiaryService } from '../services/beneficiary.service';
import { AddBeneficiaryDialogComponent } from './add-beneficiary-dialog/add-beneficiary-dialog.component';

@Component({
    selector: 'app-beneficiaries',
    templateUrl: './beneficiaries.component.html',
    styleUrls: ['./beneficiaries.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        MtxGridModule,
        MatChipsModule,
    ],
})
export class BeneficiariesComponent implements OnInit {
    private readonly beneficiaryService = inject(BeneficiaryService);
    private readonly dialog = inject(MatDialog);
    private readonly snackBar = inject(MatSnackBar);
    private readonly _fuseConfirmationService = inject(FuseConfirmationService);
    private readonly _toastService = inject(HotToastService);
    private readonly _destroyRef = inject(DestroyRef);

    beneficiaries = signal<BeneficiaryDto[]>([]);
    isLoading = signal<boolean>(true);
    isDisabled = signal<boolean>(false);
    searchInputControl = new FormControl('');

    columns = signal<MtxGridColumn[]>([
        {
            header: 'Nom',
            field: 'name',
            sortable: true,
        },
        {
            header: 'RIB',
            field: 'rib',
            sortable: true,
        },
        {
            header: 'Vérifié',
            field: 'isVerified',
            formatter: (data: BeneficiaryDto) =>
                data.isVerified ? 'Vérifié' : 'En attente',
        },
        {
            header: 'Statut',
            field: 'isActive',
            formatter: (data: BeneficiaryDto) =>
                data.isActive ? 'Actif' : 'Inactif',
        },
        {
            header: 'Actions',
            field: 'operation',
            pinned: 'right',
            type: 'button',
            buttons: [
                {
                    type: 'icon',
                    text: 'delete',
                    icon: 'delete',
                    tooltip: 'Supprimer le bénéficiaire',
                    color: 'warn',
                    click: (rowData) => this.deleteBeneficiary(rowData),
                },
            ],
        },
    ]);

    ngOnInit(): void {
        this.loadBeneficiaries();
        this.setupSearch();
    }

    private setupSearch(): void {
        this.searchInputControl.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe((searchTerm) => {
                this.filterBeneficiaries(searchTerm || '');
            });
    }

    private filterBeneficiaries(searchTerm: string): void {
        // Implement client-side filtering if needed
        // For now, we'll just reload all data
        this.loadBeneficiaries();
    }

    private loadBeneficiaries(): void {
        this.isLoading.set(true);
        this.beneficiaryService.getUserBeneficiaries().subscribe({
            next: (beneficiaries) => {
                this.beneficiaries.set(beneficiaries);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
                this.snackBar.open(
                    'Erreur lors du chargement des bénéficiaires',
                    'Fermer',
                    { duration: 3000 }
                );
            },
        });
    }

    openAddDialog(): void {
        const dialogRef = this.dialog.open(AddBeneficiaryDialogComponent, {
            data: {},
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // Beneficiary was added successfully
                this.loadBeneficiaries();
            }
        });
    }

    deleteBeneficiary(beneficiary: BeneficiaryDto): void {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Supprimer le bénéficiaire',
            message: `Êtes-vous sûr de vouloir supprimer le bénéficiaire "${beneficiary.name}" ? Cette action est irréversible.`,
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
                    this.beneficiaryService
                        .deleteBeneficiary(beneficiary.id)
                        .pipe(
                            this._toastService.observe({
                                loading: 'Suppression du bénéficiaire...',
                                success: () => {
                                    this.loadBeneficiaries();
                                    return 'Bénéficiaire supprimé avec succès.';
                                },
                                error: 'Erreur lors de la suppression du bénéficiaire.',
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
}

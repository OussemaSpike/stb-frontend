import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { BeneficiaryDto } from '../models/beneficiary.model';
import {
    InitiateTransferRequest,
    TransferSummaryDto,
} from '../models/transfer.model';
import { BeneficiaryService } from '../services/beneficiary.service';
import { TransferService } from '../services/transfer.service';

@Component({
    selector: 'app-transfers',
    templateUrl: './transfers.component.html',
    styleUrls: ['./transfers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDividerModule,
    ],
})
export class TransfersComponent implements OnInit {
    private readonly beneficiaryService = inject(BeneficiaryService);
    private readonly transferService = inject(TransferService);
    private readonly snackBar = inject(MatSnackBar);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    beneficiaries = signal<BeneficiaryDto[]>([]);
    transferSummary = signal<TransferSummaryDto | null>(null);
    isLoading = signal<boolean>(false);
    isTransferCreated = signal<boolean>(false);

    transferForm: FormGroup;

    // Computed values for UI
    activeBeneficiaries = computed(() =>
        this.beneficiaries().filter((b) => b.isActive && b.isVerified)
    );

    selectedBeneficiary = computed(() => {
        const beneficiaryId = this.transferForm?.get('beneficiaryId')?.value;
        return this.beneficiaries().find((b) => b.id === beneficiaryId) || null;
    });

    constructor() {
        this.transferForm = this.fb.group({
            beneficiaryId: ['', Validators.required],
            amount: [
                '',
                [
                    Validators.required,
                    Validators.min(0.01),
                    Validators.max(1000000),
                ],
            ],
            reason: ['', [Validators.required, Validators.maxLength(500)]],
        });
    }

    ngOnInit(): void {
        this.loadBeneficiaries();

        // Écouter les changements de montant pour vérifier les limites
        this.transferForm.get('amount')?.valueChanges.subscribe((amount) => {
            if (amount && amount > 0) {
                this.checkLimits(amount);
            }
        });
    }

    private loadBeneficiaries(): void {
        this.beneficiaryService.getUserBeneficiaries().subscribe({
            next: (beneficiaries) => {
                this.beneficiaries.set(beneficiaries);
            },
            error: () => {
                this.snackBar.open(
                    'Erreur lors du chargement des bénéficiaires',
                    'Fermer',
                    {
                        duration: 3000,
                    }
                );
            },
        });
    }

    private checkLimits(amount: number): void {
        // Vérifier les limites quotidiennes et mensuelles
        this.transferService.checkDailyLimit(amount).subscribe({
            next: (withinDailyLimit) => {
                if (!withinDailyLimit) {
                    this.snackBar.open(
                        'Le montant dépasse votre limite quotidienne',
                        'Fermer',
                        {
                            duration: 3000,
                        }
                    );
                }
            },
        });

        this.transferService.checkMonthlyLimit(amount).subscribe({
            next: (withinMonthlyLimit) => {
                if (!withinMonthlyLimit) {
                    this.snackBar.open(
                        'Le montant dépasse votre limite mensuelle',
                        'Fermer',
                        {
                            duration: 3000,
                        }
                    );
                }
            },
        });
    }

    initiateTransfer(): void {
        if (this.transferForm.valid) {
            this.isLoading.set(true);
            const request: InitiateTransferRequest = this.transferForm.value;

            this.transferService.initiateTransfer(request).subscribe({
                next: (summary) => {
                    this.transferSummary.set(summary);
                    this.isTransferCreated.set(true);
                    this.isLoading.set(false);
                    this.snackBar.open(
                        "Transfert créé avec succès. En attente de validation par l'administrateur.",
                        'Fermer',
                        { duration: 5000 }
                    );
                },
                error: (error) => {
                    this.isLoading.set(false);
                    this.snackBar.open(
                        error.error?.message ||
                            "Erreur lors de l'initiation du transfert",
                        'Fermer',
                        { duration: 3000 }
                    );
                },
            });
        }
    }

    resetForm(): void {
        this.transferForm.reset();
        this.transferSummary.set(null);
        this.isTransferCreated.set(false);
    }

    getFormFieldError(fieldName: string): string {
        const field = this.transferForm.get(fieldName);
        if (field?.errors && field.touched) {
            if (field.errors['required']) {
                switch (fieldName) {
                    case 'beneficiaryId':
                        return 'Veuillez sélectionner un bénéficiaire';
                    case 'amount':
                        return 'Le montant est requis';
                    case 'reason':
                        return 'Le motif est requis';
                    default:
                        return 'Ce champ est requis';
                }
            }
            if (field.errors['min']) {
                return 'Le montant doit être supérieur à 0';
            }
            if (field.errors['max']) {
                return 'Le montant ne peut pas dépasser 1,000,000';
            }
            if (field.errors['maxlength']) {
                return 'Le motif ne doit pas dépasser 500 caractères';
            }
        }
        return '';
    }
}

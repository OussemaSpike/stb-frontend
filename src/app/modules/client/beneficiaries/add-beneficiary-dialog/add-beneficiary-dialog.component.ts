import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateBeneficiaryRequest } from '../../models/beneficiary.model';
import { BeneficiaryService } from '../../services/beneficiary.service';

@Component({
    selector: 'app-add-beneficiary-dialog',
    template: `
        <main
            class="barcode-container -m-6 flex min-w-80 flex-col sm:min-w-160"
        >
            <header
                class="flex h-16 flex-0 items-center justify-between bg-primary pl-6 pr-3 text-on-primary sm:pl-8 sm:pr-5 rtl:flex-row-reverse dark:bg-primary-600"
            >
                <div class="flex flex-col">
                    <h1 class="text-2xl font-medium">
                        Ajouter un bénéficiaire
                    </h1>
                </div>
                <button
                    type="button"
                    title="fermer"
                    mat-icon-button
                    [tabIndex]="-1"
                    [mat-dialog-close]
                    [disabled]="isSubmitting()"
                >
                    <mat-icon
                        class="text-white"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    />
                </button>
            </header>

            <div class="bg-card overflow-y-auto rounded p-4 shadow">
                <form [formGroup]="beneficiaryForm" (ngSubmit)="onSubmit()">
                    <div class="gt-xs:flex-row flex flex-col space-y-3">
                        <div class="flex">
                            <mat-form-field
                                class="mb-3 flex-auto"
                                subscriptSizing="dynamic"
                            >
                                <mat-label>Nom du bénéficiaire</mat-label>
                                <input
                                    title="Nom du bénéficiaire"
                                    matInput
                                    required
                                    formControlName="name"
                                    placeholder="Saisir le nom complet"
                                />
                                <mat-icon
                                    class="icon-size-5"
                                    matPrefix
                                    [svgIcon]="'heroicons_solid:user-circle'"
                                />
                                @if (getFormFieldError('name')) {
                                    <mat-error>{{
                                        getFormFieldError('name')
                                    }}</mat-error>
                                }
                            </mat-form-field>
                        </div>

                        <div class="flex">
                            <mat-form-field
                                class="mb-3 flex-auto"
                                subscriptSizing="dynamic"
                            >
                                <mat-label>RIB</mat-label>
                                <input
                                    title="RIB"
                                    matInput
                                    required
                                    formControlName="rib"
                                    placeholder="20 chiffres exactement"
                                    maxlength="20"
                                />
                                <mat-icon
                                    class="icon-size-5"
                                    matPrefix
                                    [svgIcon]="
                                        'heroicons_solid:building-office'
                                    "
                                />
                                <mat-hint
                                    >Le RIB doit contenir exactement 20
                                    chiffres</mat-hint
                                >
                                @if (getFormFieldError('rib')) {
                                    <mat-error>{{
                                        getFormFieldError('rib')
                                    }}</mat-error>
                                }
                            </mat-form-field>
                        </div>
                    </div>

                    <div class="mt-8 flex justify-end">
                        <button
                            type="submit"
                            class="px-8"
                            mat-flat-button
                            [color]="'primary'"
                            [disabled]="
                                !beneficiaryForm.valid || isSubmitting()
                            "
                        >
                            @if (!isSubmitting()) {
                                <span>Ajouter</span>
                            }
                            @if (isSubmitting()) {
                                <mat-progress-spinner
                                    [diameter]="24"
                                    [mode]="'indeterminate'"
                                />
                            }
                        </button>
                    </div>
                </form>
            </div>
        </main>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
    ],
})
export class AddBeneficiaryDialogComponent {
    private readonly fb = inject(FormBuilder);
    private readonly dialogRef = inject(
        MatDialogRef<AddBeneficiaryDialogComponent>
    );
    private readonly beneficiaryService = inject(BeneficiaryService);
    private readonly snackBar = inject(MatSnackBar);

    isSubmitting = signal(false);

    beneficiaryForm: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        rib: [
            '',
            [
                Validators.required,
                Validators.pattern(/^\d{20}$/),
                Validators.minLength(20),
                Validators.maxLength(20),
            ],
        ],
    });

    getFormFieldError(fieldName: string): string | null {
        const control = this.beneficiaryForm.get(fieldName);
        if (control && control.errors && control.touched) {
            if (control.errors['required']) {
                return 'Ce champ est obligatoire';
            }
            if (control.errors['minlength']) {
                const minLength = control.errors['minlength'].requiredLength;
                return `Minimum ${minLength} caractères requis`;
            }
            if (control.errors['maxlength']) {
                const maxLength = control.errors['maxlength'].requiredLength;
                return `Maximum ${maxLength} caractères autorisés`;
            }
            if (control.errors['pattern']) {
                return 'Le RIB doit contenir exactement 20 chiffres';
            }
        }
        return null;
    }

    onSubmit(): void {
        if (this.beneficiaryForm.valid && !this.isSubmitting()) {
            this.isSubmitting.set(true);

            const request: CreateBeneficiaryRequest = {
                name: this.beneficiaryForm.value.name,
                rib: this.beneficiaryForm.value.rib,
            };

            this.beneficiaryService.createBeneficiary(request).subscribe({
                next: (beneficiary) => {
                    this.snackBar.open(
                        'Bénéficiaire ajouté avec succès',
                        'Fermer',
                        { duration: 3000 }
                    );
                    this.dialogRef.close(beneficiary);
                },
                error: (error) => {
                    console.error('Error creating beneficiary:', error);
                    this.snackBar.open(
                        "Erreur lors de l'ajout du bénéficiaire",
                        'Fermer',
                        { duration: 5000 }
                    );
                    this.isSubmitting.set(false);
                },
            });
        }
    }
}

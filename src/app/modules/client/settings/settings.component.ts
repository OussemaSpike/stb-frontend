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
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { HotToastService } from '@ngxpert/hot-toast';
import {
    ChangePasswordRequest,
    UpdateProfileRequest,
    UserService,
} from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-settings',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div
            class="flex min-w-0 flex-auto flex-col bg-gray-200 sm:absolute sm:inset-0 sm:overflow-hidden dark:bg-transparent"
        >
            <!-- Header -->
            <div
                class="bg-card relative flex flex-0 flex-col border-b px-6 py-8 sm:flex-row sm:items-center sm:justify-between md:px-8"
            >
                <!-- Title -->
                <div class="text-4xl font-extrabold tracking-tight">
                    Paramètres
                </div>
            </div>

            <!-- Main content -->
            <div class="flex flex-auto overflow-hidden">
                <div
                    class="flex w-full flex-auto flex-col overflow-hidden p-6 md:p-8"
                >
                    <mat-card class="flex-auto">
                        <mat-card-content>
                            <mat-tab-group>
                                <!-- Profile Tab -->
                                <mat-tab label="Profil">
                                    <div class="py-6">
                                        <form
                                            [formGroup]="profileForm"
                                            (ngSubmit)="updateProfile()"
                                        >
                                            <div
                                                class="grid grid-cols-1 gap-6 md:grid-cols-2"
                                            >
                                                <mat-form-field class="w-full">
                                                    <mat-label
                                                        >Prénom</mat-label
                                                    >
                                                    <input
                                                        matInput
                                                        formControlName="firstName"
                                                    />
                                                    @if (
                                                        profileForm
                                                            .get('firstName')
                                                            ?.hasError(
                                                                'minlength'
                                                            )
                                                    ) {
                                                        <mat-error
                                                            >Le prénom doit
                                                            contenir au moins 2
                                                            caractères</mat-error
                                                        >
                                                    }
                                                    @if (
                                                        profileForm
                                                            .get('firstName')
                                                            ?.hasError(
                                                                'maxlength'
                                                            )
                                                    ) {
                                                        <mat-error
                                                            >Le prénom ne peut
                                                            pas dépasser 50
                                                            caractères</mat-error
                                                        >
                                                    }
                                                </mat-form-field>

                                                <mat-form-field class="w-full">
                                                    <mat-label
                                                        >Nom de
                                                        famille</mat-label
                                                    >
                                                    <input
                                                        matInput
                                                        formControlName="lastName"
                                                    />
                                                    @if (
                                                        profileForm
                                                            .get('lastName')
                                                            ?.hasError(
                                                                'minlength'
                                                            )
                                                    ) {
                                                        <mat-error
                                                            >Le nom de famille
                                                            doit contenir au
                                                            moins 2
                                                            caractères</mat-error
                                                        >
                                                    }
                                                    @if (
                                                        profileForm
                                                            .get('lastName')
                                                            ?.hasError(
                                                                'maxlength'
                                                            )
                                                    ) {
                                                        <mat-error
                                                            >Le nom de famille
                                                            ne peut pas dépasser
                                                            50
                                                            caractères</mat-error
                                                        >
                                                    }
                                                </mat-form-field>

                                                <mat-form-field class="w-full">
                                                    <mat-label
                                                        >Numéro de
                                                        téléphone</mat-label
                                                    >
                                                    <input
                                                        matInput
                                                        formControlName="phoneNumber"
                                                        type="tel"
                                                    />
                                                    @if (
                                                        profileForm
                                                            .get('phoneNumber')
                                                            ?.hasError(
                                                                'minlength'
                                                            )
                                                    ) {
                                                        <mat-error
                                                            >Le numéro de
                                                            téléphone doit
                                                            contenir au moins 8
                                                            caractères</mat-error
                                                        >
                                                    }
                                                    @if (
                                                        profileForm
                                                            .get('phoneNumber')
                                                            ?.hasError(
                                                                'maxlength'
                                                            )
                                                    ) {
                                                        <mat-error
                                                            >Le numéro de
                                                            téléphone ne peut
                                                            pas dépasser 15
                                                            caractères</mat-error
                                                        >
                                                    }
                                                </mat-form-field>

                                                <mat-form-field
                                                    class="w-full md:col-span-2"
                                                >
                                                    <mat-label
                                                        >Adresse</mat-label
                                                    >
                                                    <input
                                                        matInput
                                                        formControlName="address"
                                                    />
                                                    @if (
                                                        profileForm
                                                            .get('address')
                                                            ?.hasError(
                                                                'maxlength'
                                                            )
                                                    ) {
                                                        <mat-error
                                                            >L'adresse ne peut
                                                            pas dépasser 255
                                                            caractères</mat-error
                                                        >
                                                    }
                                                </mat-form-field>
                                            </div>

                                            <div class="mt-6 flex justify-end">
                                                <button
                                                    mat-flat-button
                                                    color="primary"
                                                    type="submit"
                                                    [disabled]="
                                                        profileForm.invalid ||
                                                        isUpdatingProfile()
                                                    "
                                                >
                                                    @if (isUpdatingProfile()) {
                                                        <mat-icon
                                                            class="animate-spin"
                                                            >refresh</mat-icon
                                                        >
                                                    }
                                                    @if (isUpdatingProfile()) {
                                                        <span class="ml-2"
                                                            >Mise à
                                                            jour...</span
                                                        >
                                                    } @else {
                                                        <span
                                                            >Mettre à jour le
                                                            profil</span
                                                        >
                                                    }
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </mat-tab>

                                <!-- Password Tab -->
                                <mat-tab label="Mot de passe">
                                    <div class="py-6">
                                        <div class="mb-6 text-sm text-gray-600">
                                            <p>
                                                Pour des raisons de sécurité,
                                                votre mot de passe doit
                                                respecter les critères suivants
                                                :
                                            </p>
                                            <ul
                                                class="mt-2 list-inside list-disc space-y-1"
                                            >
                                                <li>Au moins 8 caractères</li>
                                                <li>Une lettre majuscule</li>
                                                <li>Une lettre minuscule</li>
                                                <li>Un chiffre</li>
                                                <li>Un caractère spécial</li>
                                            </ul>
                                        </div>

                                        <form
                                            [formGroup]="passwordForm"
                                            (ngSubmit)="changePassword()"
                                        >
                                            <div
                                                class="grid max-w-lg grid-cols-1 gap-6"
                                            >
                                                <mat-form-field class="w-full">
                                                    <mat-label
                                                        >Ancien mot de
                                                        passe</mat-label
                                                    >
                                                    <input
                                                        matInput
                                                        formControlName="oldPassword"
                                                        [type]="
                                                            hideOldPassword()
                                                                ? 'password'
                                                                : 'text'
                                                        "
                                                        autocomplete="current-password"
                                                    />
                                                    <button
                                                        mat-icon-button
                                                        matSuffix
                                                        type="button"
                                                        (click)="
                                                            hideOldPassword.set(
                                                                !hideOldPassword()
                                                            )
                                                        "
                                                        [attr.aria-label]="
                                                            'Hide password'
                                                        "
                                                        [attr.aria-pressed]="
                                                            hideOldPassword()
                                                        "
                                                    >
                                                        <mat-icon>
                                                            {{
                                                                hideOldPassword()
                                                                    ? 'visibility_off'
                                                                    : 'visibility'
                                                            }}
                                                        </mat-icon>
                                                    </button>
                                                    @if (
                                                        passwordForm
                                                            .get('oldPassword')
                                                            ?.hasError(
                                                                'required'
                                                            )
                                                    ) {
                                                        <mat-error
                                                            >L'ancien mot de
                                                            passe est
                                                            requis</mat-error
                                                        >
                                                    }
                                                </mat-form-field>

                                                <mat-form-field class="w-full">
                                                    <mat-label
                                                        >Nouveau mot de
                                                        passe</mat-label
                                                    >
                                                    <input
                                                        matInput
                                                        formControlName="newPassword"
                                                        [type]="
                                                            hideNewPassword()
                                                                ? 'password'
                                                                : 'text'
                                                        "
                                                        autocomplete="new-password"
                                                    />
                                                    <button
                                                        mat-icon-button
                                                        matSuffix
                                                        type="button"
                                                        (click)="
                                                            hideNewPassword.set(
                                                                !hideNewPassword()
                                                            )
                                                        "
                                                        [attr.aria-label]="
                                                            'Hide password'
                                                        "
                                                        [attr.aria-pressed]="
                                                            hideNewPassword()
                                                        "
                                                    >
                                                        <mat-icon>
                                                            {{
                                                                hideNewPassword()
                                                                    ? 'visibility_off'
                                                                    : 'visibility'
                                                            }}
                                                        </mat-icon>
                                                    </button>
                                                    @if (
                                                        passwordForm
                                                            .get('newPassword')
                                                            ?.hasError(
                                                                'required'
                                                            )
                                                    ) {
                                                        <mat-error
                                                            >Le nouveau mot de
                                                            passe est
                                                            requis</mat-error
                                                        >
                                                    }
                                                    @if (
                                                        passwordForm
                                                            .get('newPassword')
                                                            ?.hasError(
                                                                'minlength'
                                                            )
                                                    ) {
                                                        <mat-error
                                                            >Le mot de passe
                                                            doit contenir au
                                                            moins 8
                                                            caractères</mat-error
                                                        >
                                                    }
                                                    @if (
                                                        passwordForm
                                                            .get('newPassword')
                                                            ?.hasError(
                                                                'pattern'
                                                            )
                                                    ) {
                                                        <mat-error
                                                            >Le mot de passe
                                                            doit respecter tous
                                                            les critères de
                                                            sécurité</mat-error
                                                        >
                                                    }
                                                </mat-form-field>

                                                <mat-form-field class="w-full">
                                                    <mat-label
                                                        >Confirmer le nouveau
                                                        mot de passe</mat-label
                                                    >
                                                    <input
                                                        matInput
                                                        formControlName="confirmPassword"
                                                        [type]="
                                                            hideConfirmPassword()
                                                                ? 'password'
                                                                : 'text'
                                                        "
                                                        autocomplete="new-password"
                                                    />
                                                    <button
                                                        mat-icon-button
                                                        matSuffix
                                                        type="button"
                                                        (click)="
                                                            hideConfirmPassword.set(
                                                                !hideConfirmPassword()
                                                            )
                                                        "
                                                        [attr.aria-label]="
                                                            'Hide password'
                                                        "
                                                        [attr.aria-pressed]="
                                                            hideConfirmPassword()
                                                        "
                                                    >
                                                        <mat-icon>
                                                            {{
                                                                hideConfirmPassword()
                                                                    ? 'visibility_off'
                                                                    : 'visibility'
                                                            }}
                                                        </mat-icon>
                                                    </button>
                                                    @if (
                                                        passwordForm
                                                            .get(
                                                                'confirmPassword'
                                                            )
                                                            ?.hasError(
                                                                'required'
                                                            )
                                                    ) {
                                                        <mat-error
                                                            >La confirmation du
                                                            mot de passe est
                                                            requise</mat-error
                                                        >
                                                    }
                                                    @if (
                                                        passwordForm.hasError(
                                                            'passwordMismatch'
                                                        ) &&
                                                        passwordForm.get(
                                                            'confirmPassword'
                                                        )?.touched
                                                    ) {
                                                        <mat-error
                                                            >Les mots de passe
                                                            ne correspondent
                                                            pas</mat-error
                                                        >
                                                    }
                                                </mat-form-field>
                                            </div>

                                            <div
                                                class="mt-8 flex items-center justify-between"
                                            >
                                                <div
                                                    class="text-sm text-gray-500"
                                                >
                                                    <p>
                                                        Vous serez déconnecté
                                                        après le changement de
                                                        mot de passe
                                                    </p>
                                                </div>
                                                <button
                                                    mat-flat-button
                                                    color="primary"
                                                    type="submit"
                                                    [disabled]="
                                                        passwordForm.invalid ||
                                                        isChangingPassword()
                                                    "
                                                    class="px-6"
                                                >
                                                    @if (isChangingPassword()) {
                                                        <mat-icon
                                                            class="animate-spin"
                                                            >refresh</mat-icon
                                                        >
                                                    }
                                                    @if (isChangingPassword()) {
                                                        <span class="ml-2"
                                                            >Changement...</span
                                                        >
                                                    } @else {
                                                        <span
                                                            >Changer le mot de
                                                            passe</span
                                                        >
                                                    }
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </mat-tab>
                            </mat-tab-group>
                        </mat-card-content>
                    </mat-card>
                </div>
            </div>
        </div>
    `,
})
export class SettingsComponent implements OnInit {
    private readonly _fb = inject(FormBuilder);
    private readonly _userService = inject(UserService);
    private readonly _toastService = inject(HotToastService);
    private readonly _destroyRef = inject(DestroyRef);

    readonly user = signal<User | null>(null);
    readonly isUpdatingProfile = signal<boolean>(false);
    readonly isChangingPassword = signal<boolean>(false);
    readonly hideOldPassword = signal<boolean>(true);
    readonly hideNewPassword = signal<boolean>(true);
    readonly hideConfirmPassword = signal<boolean>(true);

    profileForm!: FormGroup;
    passwordForm!: FormGroup;

    ngOnInit(): void {
        this.initializeForms();
        this.loadUserData();
    }

    private initializeForms(): void {
        // Profile form
        this.profileForm = this._fb.group({
            firstName: [
                '',
                [Validators.minLength(2), Validators.maxLength(50)],
            ],
            lastName: ['', [Validators.minLength(2), Validators.maxLength(50)]],
            phoneNumber: [
                '',
                [Validators.minLength(8), Validators.maxLength(15)],
            ],
            address: ['', [Validators.maxLength(255)]],
        });

        // Password form
        this.passwordForm = this._fb.group(
            {
                oldPassword: ['', [Validators.required]],
                newPassword: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.pattern(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
                        ),
                    ],
                ],
                confirmPassword: ['', [Validators.required]],
            },
            { validators: this.passwordMatchValidator }
        );
    }

    private passwordMatchValidator(group: FormGroup) {
        const newPassword = group.get('newPassword')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return newPassword === confirmPassword
            ? null
            : { passwordMismatch: true };
    }

    private loadUserData(): void {
        this._userService.user$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((user: User) => {
                if (user) {
                    this.user.set(user);
                    this.profileForm.patchValue({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phoneNumber: user.phoneNumber,
                        address: user.address,
                    });
                }
            });
    }

    updateProfile(): void {
        if (this.profileForm.valid) {
            this.isUpdatingProfile.set(true);

            const updateData: UpdateProfileRequest = {
                address: this.profileForm.value.addressn,
                firstName: this.profileForm.value.firstName,
                lastName: this.profileForm.value.lastName,
                phoneNumber: this.profileForm.value.phoneNumber,
            };

            this._userService
                .updateProfile(updateData)
                .pipe(
                    this._toastService.observe({
                        loading: 'Mise à jour du profil...',
                        success: 'Profil mis à jour avec succès',
                        error: 'Erreur lors de la mise à jour du profil',
                    }),
                    finalize(() => this.isUpdatingProfile.set(false)),
                    takeUntilDestroyed(this._destroyRef)
                )
                .subscribe();
        }
    }

    changePassword(): void {
        if (this.passwordForm.valid) {
            this.isChangingPassword.set(true);

            const passwordData: ChangePasswordRequest = this.passwordForm.value;

            this._userService
                .changePassword(passwordData)
                .pipe(
                    this._toastService.observe({
                        loading: 'Changement du mot de passe...',
                        success: () => {
                            this.passwordForm.reset();
                            return 'Mot de passe changé avec succès';
                        },
                        error: 'Erreur lors du changement du mot de passe',
                    }),
                    finalize(() => this.isChangingPassword.set(false)),
                    takeUntilDestroyed(this._destroyRef)
                )
                .subscribe();
        }
    }
}

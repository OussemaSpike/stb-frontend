import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { HotToastService } from '@ngxpert/hot-toast';
import { UserService } from 'app/core/user/user.service';
import { catchError, of } from 'rxjs';

import {
    BANK_ACCOUNT_TYPE_OPTIONS,
    BankAccountType,
    CreateUserRequest,
    UpdateUserRequest,
    User,
} from 'app/core/user/user.types';
import { TUNISIAN_BRANCHES } from '../branches';

@Component({
    selector: 'app-add-admins',
    imports: [
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatStepperModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './client-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFormComponent implements OnInit {
    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _clientService = inject(UserService);
    private readonly _formBuilder = inject(FormBuilder);
    private readonly toastService = inject(HotToastService);
    private readonly _dialogRef = inject(MatDialogRef);
    private readonly DIALOG_DATA = inject(MAT_DIALOG_DATA);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    readonly createdClient = signal<User | null>(null);
    readonly updateMode = signal(!!this.DIALOG_DATA.client);
    readonly bankAccountTypeOptions = BANK_ACCOUNT_TYPE_OPTIONS;
    readonly branches = TUNISIAN_BRANCHES;

    clientForm = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        cin: [
            '',
            [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(8),
            ],
        ],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
        accountType: ['', [Validators.required]],
        branchCode: ['', [Validators.required]],
    });

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    ngOnInit(): void {
        if (this.DIALOG_DATA.client) {
            this.clientForm.patchValue({
                email: this.DIALOG_DATA.client.email,
                firstName: this.DIALOG_DATA.client.firstName,
                lastName: this.DIALOG_DATA.client.lastName,
                cin: this.DIALOG_DATA.client.cin,
                phone: this.DIALOG_DATA.client.phoneNumber,
                accountType: this.DIALOG_DATA.client.bankAccount?.accountType,
                branchCode: this.DIALOG_DATA.client.branchCode || '001', // Default to first branch if not set
            });
            this.clientForm.controls.email.disable();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    // Submit the form
    submitForm() {
        this.clientForm.disable();
        if (this.updateMode()) {
            this.updateClient();
        } else {
            this.createClient();
        }
    }

    updateClient() {
        const payload: UpdateUserRequest = {
            id: this.DIALOG_DATA.client.id,
            firstName: this.clientForm.value.firstName,
            lastName: this.clientForm.value.lastName,
            phone: this.clientForm.value.phone,
            accountType: this.clientForm.value.accountType as BankAccountType,
            branchCode: this.clientForm.value.branchCode,
        };

        this._clientService
            .updateUser(payload)
            .pipe(
                this.toastService.observe({
                    loading: 'Enregistrement des modifications...',
                    success: () => {
                        this._dialogRef.close('success');
                        return 'Client mis à jour avec succès.';
                    },
                    error: () => {
                        this.clientForm.enable();
                        return 'Échec de la mise à jour du client.';
                    },
                }),
                catchError((error: unknown) => {
                    return of(error);
                })
            )
            .subscribe();
    }

    createClient() {
        const payload: CreateUserRequest = {
            firstName: this.clientForm.value.firstName!,
            lastName: this.clientForm.value.lastName!,
            email: this.clientForm.value.email!,
            phone: this.clientForm.value.phone!,
            cin: this.clientForm.value.cin!,
            accountType: this.clientForm.value.accountType! as BankAccountType,
            branchCode: this.clientForm.value.branchCode!,
        };

        this._clientService
            .createUser(payload)
            .pipe(
                this.toastService.observe({
                    loading: 'Création du client...',
                    success: (res: User) => {
                        this.createdClient.set(res);
                        this.clientForm.enable();
                        this._dialogRef.close('success');

                        return 'Client ajouté avec succès.';
                    },
                    error: () => {
                        this.clientForm.enable();
                        return "Échec de l'ajout du client.";
                    },
                }),
                catchError((error: unknown) => {
                    return of(error);
                })
            )
            .subscribe();
    }

    close(response: 'cancel' | 'success') {
        this._dialogRef.close(response);
    }
}

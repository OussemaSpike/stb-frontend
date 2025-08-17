import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    inject,
    signal,
} from '@angular/core';
import {
    AbstractControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { HotToastService } from '@ngxpert/hot-toast';
import { AuthService } from 'app/core/auth/auth.service';
import { ResetPasswordRequest } from 'app/core/auth/auth.types';
import { passwordPattern } from 'app/shared/utils/regex-patterns';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterLink,
    ],
})
export class AuthResetPasswordComponent implements OnInit {
    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------
    private readonly _authService = inject(AuthService);
    private readonly _formBuilder = inject(UntypedFormBuilder);
    private readonly _activateRoute = inject(ActivatedRoute);
    private readonly _hotToast = inject(HotToastService);
    private readonly _router = inject(Router);
    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    resetPasswordForm: FormGroup;
    readonly showAlert = signal(false);
    readonly showPasswordCriteria = signal(false);
    code: string;

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get passwordControl(): AbstractControl {
        return this.resetPasswordForm.get('password');
    }

    get passwordConfirmControl(): AbstractControl {
        return this.resetPasswordForm.get('passwordConfirm');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.code = this._activateRoute.snapshot.queryParams.code;
        // Create the form
        this.resetPasswordForm = this._formBuilder.group(
            {
                password: [
                    '',
                    [Validators.required, Validators.pattern(passwordPattern)],
                ],
                passwordConfirm: ['', Validators.required],
            },
            {
                validators: FuseValidators.mustMatch(
                    'password',
                    'passwordConfirm'
                ),
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void {
        if (this.resetPasswordForm.invalid) {
            return;
        }

        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert.set(false);

        const resetPasswordRequest: ResetPasswordRequest = {
            code: this.code,
            password: this.resetPasswordForm.get('password').value,
            confirmPassword:
                this.resetPasswordForm.get('passwordConfirm').value,
        };

        // Send the request to the server
        this._authService.resetPassword(resetPasswordRequest).subscribe({
            next: () => {
                this.resetPasswordForm.enable();

                // Set the alert
                this.alert = {
                    type: 'success',
                    message: 'Mot de passe réinitialisé avec succès',
                };

                // Show the alert
                this.showAlert.set(true);

                // Navigate to sign-in after a delay
                setTimeout(() => {
                    this._router.navigate(['/sign-in']);
                }, 2000);
            },
            error: () => {
                this.resetPasswordForm.enable();
                this.resetPasswordForm.reset();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message:
                        'Une erreur est survenue lors de la réinitialisation du mot de passe',
                };

                // Show the alert
                this.showAlert.set(true);
            },
        });
    }
}

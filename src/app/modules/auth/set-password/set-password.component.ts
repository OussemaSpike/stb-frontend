import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
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
import { SetPasswordRequest } from 'app/core/auth/auth.types';
import { PasswordStrengthValidatorComponent } from 'app/shared/components/password-strength-validator/password-strength-validator.component';
import { passwordPattern } from 'app/shared/utils/regex-patterns';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'auth-reset-password',
    templateUrl: './set-password.component.html',
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
        PasswordStrengthValidatorComponent,
    ],
})
export class SetPasswordComponent implements OnInit {
    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------
    private readonly _authService = inject(AuthService);
    private readonly _formBuilder = inject(FormBuilder);
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
    setPasswordForm: FormGroup;
    readonly showAlert = signal(false);
    readonly showPasswordCriteria = signal(false);
    code: string;

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get passwordControl(): AbstractControl {
        return this.setPasswordForm.get('password');
    }

    get passwordConfirmControl(): AbstractControl {
        return this.setPasswordForm.get('passwordConfirm');
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
        this.setPasswordForm = this._formBuilder.group(
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
    setPassword(): void {
        // Return if the form is invalid
        if (this.setPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.setPasswordForm.disable();

        // Hide the alert
        this.showAlert.set(false);

        const setPasswordRequest: SetPasswordRequest = {
            code: this.code,
            password: this.setPasswordForm.get('password').value,
            confirmPassword: this.setPasswordForm.get('passwordConfirm').value,
        };

        // Send the request to the server
        this._authService.setPassword(setPasswordRequest).subscribe({
            next: () => {
                this.setPasswordForm.enable();

                // Set the alert
                this.alert = {
                    type: 'success',
                    message:
                        'Votre mot de passe a été défini avec succès. Vous pouvez maintenant vous connecter.',
                };

                // Show the alert
                this.showAlert.set(true);

                // Navigate to sign-in after a delay
                setTimeout(() => {
                    this._router.navigate(['/sign-in']);
                }, 2000);
            },
            error: () => {
                this.setPasswordForm.enable();
                this.setPasswordForm.reset();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message:
                        'Une erreur est survenue lors de la définition du mot de passe',
                };

                // Show the alert
                this.showAlert.set(true);
            },
        });
    }
}

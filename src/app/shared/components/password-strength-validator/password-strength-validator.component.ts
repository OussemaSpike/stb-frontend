import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    input,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'password-strength-validator',
    imports: [MatCheckboxModule, NgClass, MatIconModule],
    templateUrl: './password-strength-validator.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthValidatorComponent {
    readonly password = input<string>('');

    passwordCriteria = computed(() => {
        const pwd = this.password();
        return {
            hasUpperCase: /[A-Z]/.test(pwd),
            hasLowerCase: /[a-z]/.test(pwd),
            hasNumeric: /\d/.test(pwd),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        };
    });
}

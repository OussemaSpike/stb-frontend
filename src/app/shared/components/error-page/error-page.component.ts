import { NgOptimizedImage } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'lib-error-page',
    imports: [MatButtonModule, RouterModule, NgOptimizedImage],
    templateUrl: './error-page.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent {
    readonly showButton = input(true);
    readonly redirectRoute = input('/home');
    readonly error = input<number>(401);

    readonly title = computed(() => {
        switch (this.error()) {
            case 401:
                return 'Non autorisé';
            case 404:
                return 'Page non trouvée';
            default:
                return 'Erreur serveur';
        }
    });

    readonly description = computed(() => {
        switch (this.error()) {
            case 401:
                return "Vous n'avez pas l'autorisation d'accéder à cette ressource.";
            case 404:
                return "La page que vous recherchez n'existe pas.";
            default:
                return "Une erreur s'est produite sur le serveur.";
        }
    });

    readonly image = computed(() => {
        switch (this.error()) {
            case 401:
                return 'images/illustrations/401.svg';
            case 404:
                return 'images/illustrations/404.svg';
            default:
                return 'images/illustrations/500.svg';
        }
    });
}

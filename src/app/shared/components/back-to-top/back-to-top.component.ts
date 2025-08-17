import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DOCUMENT,
    HostListener,
    inject,
    input,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'lib-back-to-top',
    imports: [MatButtonModule, MatIconModule, NgClass],
    templateUrl: './back-to-top.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTopComponent {
    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------
    private readonly document = inject(DOCUMENT);

    // -----------------------------------------------------------------------------------------------------
    // @ Inputs
    // -----------------------------------------------------------------------------------------------------
    readonly showAfter = input(300); // Pixels scrolled before showing
    readonly scrollToPosition = input(0); // Position to scroll to
    readonly animationDuration = input(500); // Animation duration in ms
    readonly position = input<'bottom-right' | 'bottom-left' | 'bottom-center'>(
        'bottom-right'
    );
    readonly size = input<'small' | 'medium' | 'large'>('small');
    readonly color = input<'primary' | 'accent' | 'warn'>('primary');
    readonly positionClass = computed(() => {
        switch (this.position()) {
            case 'bottom-left':
                return 'bottom-6 left-6';
            case 'bottom-center':
                return 'bottom-6 left-1/2 -translate-x-1/2';
            case 'bottom-right':
            default:
                return 'bottom-6 right-6';
        }
    });

    readonly sizeClass = computed(() => {
        switch (this.size()) {
            case 'small':
                return 'w-12 h-12 text-sm';
            case 'large':
                return 'w-16 h-16 text-xl';
            case 'medium':
            default:
                return 'w-14 h-14 text-base';
        }
    });

    // -----------------------------------------------------------------------------------------------------
    // @ Signals and State
    // -----------------------------------------------------------------------------------------------------
    readonly isVisible = signal(false);

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    @HostListener('window:scroll', [])
    onWindowScroll(): void {
        const scrollPosition =
            this.document.documentElement.scrollTop ||
            this.document.body.scrollTop;
        this.isVisible.set(scrollPosition > this.showAfter());
    }

    scrollToTop(): void {
        const scrollToOptions: ScrollToOptions = {
            top: this.scrollToPosition(),
            behavior: 'smooth',
        };

        this.document.documentElement.scrollTo(scrollToOptions);
    }
}

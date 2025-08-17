import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    signal,
    TemplateRef,
    viewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';

import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { NotificationsService } from './notifications.service';
import { Notification } from './notifications.types';
import { TransferNotificationComponent } from './types/transfer-notification/transfer-notification.component';

@Component({
    selector: 'notifications',
    templateUrl: './notifications.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'notifications',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        NgClass,
        NgTemplateOutlet,
        MatProgressSpinnerModule,
        TransferNotificationComponent,
    ],
})
export class NotificationsComponent {
    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------

    private readonly _notificationsService = inject(NotificationsService);
    private readonly _userService = inject(UserService);
    private readonly _overlay = inject(Overlay);
    private readonly _viewContainerRef = inject(ViewContainerRef);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------

    accessToken: string = localStorage.getItem('accessToken') || '';
    private _overlayRef: OverlayRef;

    // -----------------------------------------------------------------------------------------------------
    // @ Observables and signals
    // -----------------------------------------------------------------------------------------------------

    readonly _notificationsOrigin = viewChild<MatButton>('notificationsOrigin');
    readonly _notificationsPanel =
        viewChild<TemplateRef<void>>('notificationsPanel');
    readonly loadingNotifications = signal(false);
    readonly notifications = this._notificationsService.notifications;

    readonly unreadCount = signal(0);
    readonly page = signal(0);
    readonly isLastPage = signal(false);

    // -----------------------------------------------------------------------------------------------------
    // @ Constructor
    // -----------------------------------------------------------------------------------------------------

    constructor() {
        this._notificationsService.getUnreadCount().subscribe((count) => {
            this.unreadCount.set(count);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the notifications panel
     */
    openPanel(): void {
        // Return if the notifications panel or its origin is not defined
        if (!this._notificationsPanel() || !this._notificationsOrigin()) {
            return;
        }

        // Create the overlay if it doesn't exist
        if (!this._overlayRef) {
            this._createOverlay();

            this.fetchNotifications();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(
            new TemplatePortal(
                this._notificationsPanel(),
                this._viewContainerRef
            )
        );
    }

    fetchNotifications(): void {
        if (this._notificationsService.notifications().length === 0) {
            this.loadingNotifications.set(true);
            this._notificationsService.getAll(this.page()).subscribe({
                next: () => {
                    this.loadingNotifications.set(false);
                },
            });
        }
    }

    fetchMoreNotifications(): void {
        if (this.isLastPage()) {
            return;
        }
        this.page.set(this.page() + 1);
        this.loadingNotifications.set(true);
        this._notificationsService.getAll(this.page()).subscribe({
            next: () => {
                this.loadingNotifications.set(false);
            },
        });
    }

    /**
     * Close the notifications panel
     */
    closePanel(): void {
        this._overlayRef.detach();
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): void {
        // Mark all as read
        this._notificationsService.markAllAsRead().subscribe();
        this.unreadCount.set(0);
    }

    /**
     * Toggle read status of the given notification
     */
    markAsRead(notification: Notification): void {
        // Update the notification
        this._notificationsService.markAsRead(notification.id).subscribe();
        this.unreadCount.set(this.unreadCount() - 1);
    }

    /**
     * Delete the given notification
     */
    delete(notification: Notification): void {
        // Delete the notification
        this._notificationsService.deleteById(notification.id).subscribe();
        this.unreadCount.set(this.unreadCount() - 1);
    }

    clearAll(): void {
        this._notificationsService.clearAll().subscribe();
        this.unreadCount.set(0);
    }

    navigateToNotification(notification: Notification): void {
        this.markAsRead(notification);

        switch (notification.type) {
            case 'USER_ONBOARDING_COMPLETED':
                this._router.navigate(['/clients']);
                break;
            case 'FOUNDATION_DOCUMENT_UPLOADED':
            case 'FOUNDATION_DOCUMENT_VALIDATED':
            case 'FOUNDATION_DOCUMENT_REJECTED': {
                const foundationId = notification.data['foundationId'];
                if (foundationId) {
                    this._router.navigate([
                        '/company/foundations',
                        foundationId,
                    ]);
                }
                break;
            }
            case 'NEW_TRANSFER_CREATED':
            case 'TRANSFER_APPROVED':
            case 'TRANSFER_REJECTED':
            case 'TRANSFER_COMPLETED':
            case 'TRANSFER_FAILED': {
                const transferId = notification.data['transferId'];
                if (transferId) {
                    // Navigate to transfer details page or transfers list
                    this._router.navigate(['/transfers', transferId]);
                }
                break;
            }
            default:
                break;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(
                    this._notificationsOrigin()._elementRef.nativeElement
                )
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom',
                    },
                ]),
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }
}

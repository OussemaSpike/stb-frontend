import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimeAgoPipe } from 'app/shared/pipes';
import { NotificationUtilsService } from '../../notifications-utils.service';
import {
    Notification,
    TransferNotificationData,
} from '../../notifications.types';

@Component({
    selector: 'notif-transfer-notification',
    imports: [AsyncPipe, NgClass, MatIconModule, TimeAgoPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex flex-auto flex-col gap-1">
            <div class="flex items-center gap-1">
                <mat-icon
                    class="icon-size-6"
                    [ngClass]="iconConfig().color"
                    [svgIcon]="iconConfig().icon"
                />
                <p class="line-clamp-1 font-bold">{{ title() }}</p>
            </div>

            <div class="text-secondary text-sm">
                <p class="line-clamp-2">
                    {{ getTransferMessage() }}
                </p>
                <p class="mt-1">
                    <span class="text-xs">Référence:</span>
                    <span class="font-mono text-xs">{{
                        notificationData().reference
                    }}</span>
                </p>
                <p class="mt-1">
                    <span class="text-xs">Bénéficiaire:</span>
                    <span class="text-xs font-medium">{{
                        notificationData().beneficiaryName
                    }}</span>
                </p>
                @if (shouldShowRib()) {
                    <p class="mt-1">
                        <span class="text-xs">RIB:</span>
                        <span class="font-mono text-xs">{{
                            notificationData().beneficiaryRib
                        }}</span>
                    </p>
                }
                @if (shouldShowReason() && notificationData().reason) {
                    <p class="mt-1">
                        <span class="text-xs">{{ getReasonLabel() }}:</span>
                        <span class="text-xs" [ngClass]="getReasonClass()">{{
                            notificationData().reason
                        }}</span>
                    </p>
                }
            </div>

            <div class="mt-2 flex items-center justify-between">
                <span
                    class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                    [ngClass]="[statusBadge().bgColor, statusBadge().textColor]"
                >
                    {{ statusBadge().label }}
                </span>
                <span class="text-secondary text-xs">
                    {{ notificationData().createdAt | ngTimeAgoPipe | async }}
                </span>
            </div>
        </div>
    `,
})
export class TransferNotificationComponent {
    private readonly _notificationUtils = inject(NotificationUtilsService);

    readonly notification = input.required<Notification>();

    readonly notificationData = (): TransferNotificationData =>
        this.notification().data as any;

    readonly title = () =>
        this._notificationUtils.getNotificationTitle(this.notification().type);

    readonly iconConfig = () =>
        this._notificationUtils.getNotificationIcon(this.notification().type);

    readonly statusBadge = () =>
        this._notificationUtils.getStatusBadge(this.notification().type);

    getTransferMessage(): string {
        const data = this.notificationData();
        const amount = this._notificationUtils.formatCurrency(
            data.amount,
            data.currency
        );
        const type = this.notification().type;

        switch (type) {
            case 'NEW_TRANSFER_CREATED':
                return `Un virement de ${amount} a été créé par ${data.senderName}`;
            case 'TRANSFER_APPROVED':
                return `Le virement de ${amount} vers ${data.beneficiaryName} a été approuvé`;
            case 'TRANSFER_REJECTED':
                return `Le virement de ${amount} vers ${data.beneficiaryName} a été rejeté`;
            case 'TRANSFER_COMPLETED':
                return `Le virement de ${amount} vers ${data.beneficiaryName} a été exécuté avec succès`;
            case 'TRANSFER_FAILED':
                return `Le virement de ${amount} vers ${data.beneficiaryName} a échoué`;
            default:
                return `Virement de ${amount}`;
        }
    }

    shouldShowRib(): boolean {
        const type = this.notification().type;
        return ['TRANSFER_APPROVED', 'TRANSFER_COMPLETED'].includes(type);
    }

    shouldShowReason(): boolean {
        const type = this.notification().type;
        return ['TRANSFER_REJECTED', 'TRANSFER_FAILED'].includes(type);
    }

    getReasonLabel(): string {
        const type = this.notification().type;
        return type === 'TRANSFER_FAILED' ? 'Raison' : 'Motif';
    }

    getReasonClass(): string {
        const type = this.notification().type;
        return type === 'TRANSFER_FAILED' ? 'text-red-600' : '';
    }
}

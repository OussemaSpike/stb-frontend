import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimeAgoPipe } from 'app/shared/pipes';
import {
    Notification,
    TransferNotificationData,
} from '../../notifications.types';

@Component({
    selector: 'notif-new-transfer-created',
    imports: [AsyncPipe, CurrencyPipe, MatIconModule, TimeAgoPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex flex-auto flex-col gap-1">
            <div class="flex items-center gap-1">
                <mat-icon
                    class="text-blue-500 icon-size-6"
                    [svgIcon]="'heroicons_solid:plus-circle'"
                />
                <p class="line-clamp-1 font-bold">Nouveau virement créé</p>
            </div>

            <div class="text-secondary text-sm">
                <p class="line-clamp-2">
                    Un virement de
                    <span class="font-medium">{{
                        notificationData().amount
                            | currency
                                : notificationData().currency
                                : 'symbol'
                                : '1.2-2'
                    }}</span>
                    a été créé par
                    <span class="font-medium">{{
                        notificationData().senderName
                    }}</span>
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
            </div>

            <div class="mt-2 flex items-center justify-between">
                <span
                    class="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                >
                    En attente d'approbation
                </span>
                <span class="text-secondary text-xs">
                    {{ notificationData().createdAt | ngTimeAgoPipe | async }}
                </span>
            </div>
        </div>
    `,
})
export class NewTransferCreatedComponent {
    readonly notification = input.required<Notification>();

    readonly notificationData = (): TransferNotificationData =>
        this.notification().data as any;
}

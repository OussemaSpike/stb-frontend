import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TimeAgoPipe } from 'app/shared/pipes';
import {
    Notification,
    TransferNotificationData,
} from '../../notifications.types';

@Component({
    selector: 'notif-transfer-failed',
    imports: [AsyncPipe, CurrencyPipe, MatIconModule, TimeAgoPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex flex-auto flex-col gap-1">
            <div class="flex items-center gap-1">
                <mat-icon
                    class="text-red-600 icon-size-6"
                    [svgIcon]="'heroicons_solid:exclamation-triangle'"
                />
                <p class="line-clamp-1 font-bold">Virement échoué</p>
            </div>

            <div class="text-secondary text-sm">
                <p class="line-clamp-2">
                    Le virement de
                    <span class="font-medium">{{
                        notificationData().amount
                            | currency
                                : notificationData().currency
                                : 'symbol'
                                : '1.2-2'
                    }}</span>
                    vers
                    <span class="font-medium">{{
                        notificationData().beneficiaryName
                    }}</span>
                    a échoué
                </p>
                <p class="mt-1">
                    <span class="text-xs">Référence:</span>
                    <span class="font-mono text-xs">{{
                        notificationData().reference
                    }}</span>
                </p>
                @if (notificationData().reason) {
                    <p class="mt-1">
                        <span class="text-xs">Raison:</span>
                        <span class="text-xs text-red-600">{{
                            notificationData().reason
                        }}</span>
                    </p>
                }
            </div>

            <div class="mt-2 flex items-center justify-between">
                <span
                    class="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800"
                >
                    Échec
                </span>
                <span class="text-secondary text-xs">
                    {{ notificationData().createdAt | ngTimeAgoPipe | async }}
                </span>
            </div>
        </div>
    `,
})
export class TransferFailedComponent {
    readonly notification = input.required<Notification>();

    readonly notificationData = (): TransferNotificationData =>
        this.notification().data as any;
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { TransferNotificationData } from './notifications.types';

export interface Transfer {
    id: number;
    reference: string;
    amount: number;
    currency: string;
    beneficiary: {
        name: string;
        rib: string;
    };
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'FAILED';
    user: {
        fullName: string;
    };
    createdAt: Date;
}

export enum NotificationType {
    NEW_TRANSFER_CREATED = 'NEW_TRANSFER_CREATED',
    TRANSFER_APPROVED = 'TRANSFER_APPROVED',
    TRANSFER_REJECTED = 'TRANSFER_REJECTED',
    TRANSFER_COMPLETED = 'TRANSFER_COMPLETED',
    TRANSFER_FAILED = 'TRANSFER_FAILED',
}

@Injectable({
    providedIn: 'root',
})
export class TransferNotificationService {
    constructor(private notificationsService: NotificationsService) {}

    /**
     * Creates notification data for transfer - mirrors the Spring Boot service
     */
    private createTransferNotificationData(
        transfer: Transfer
    ): TransferNotificationData {
        return {
            transferId: transfer.id.toString(),
            reference: transfer.reference,
            amount: transfer.amount.toString(),
            currency: transfer.currency,
            beneficiaryName: transfer.beneficiary.name,
            beneficiaryRib: transfer.beneficiary.rib,
            reason: transfer.reason,
            status: transfer.status,
            senderName: transfer.user.fullName,
            createdAt: transfer.createdAt,
        };
    }

    /**
     * Send transfer created notification
     */
    sendTransferCreatedNotification(
        transfer: Transfer,
        userId: string
    ): Observable<any> {
        const notificationData = this.createTransferNotificationData(transfer);

        return this.notificationsService.create({
            userId,
            type: NotificationType.NEW_TRANSFER_CREATED,
            data: notificationData,
            isRead: false,
        });
    }

    /**
     * Send transfer approved notification
     */
    sendTransferApprovedNotification(
        transfer: Transfer,
        userId: string
    ): Observable<any> {
        const notificationData = this.createTransferNotificationData(transfer);

        return this.notificationsService.create({
            userId,
            type: NotificationType.TRANSFER_APPROVED,
            data: notificationData,
            isRead: false,
        });
    }

    /**
     * Send transfer rejected notification
     */
    sendTransferRejectedNotification(
        transfer: Transfer,
        userId: string,
        rejectionReason?: string
    ): Observable<any> {
        const notificationData = this.createTransferNotificationData(transfer);
        if (rejectionReason) {
            notificationData.reason = rejectionReason;
        }

        return this.notificationsService.create({
            userId,
            type: NotificationType.TRANSFER_REJECTED,
            data: notificationData,
            isRead: false,
        });
    }

    /**
     * Send transfer completed notification
     */
    sendTransferCompletedNotification(
        transfer: Transfer,
        userId: string
    ): Observable<any> {
        const notificationData = this.createTransferNotificationData(transfer);

        return this.notificationsService.create({
            userId,
            type: NotificationType.TRANSFER_COMPLETED,
            data: notificationData,
            isRead: false,
        });
    }

    /**
     * Send transfer failed notification
     */
    sendTransferFailedNotification(
        transfer: Transfer,
        userId: string,
        failureReason?: string
    ): Observable<any> {
        const notificationData = this.createTransferNotificationData(transfer);
        if (failureReason) {
            notificationData.reason = failureReason;
        }

        return this.notificationsService.create({
            userId,
            type: NotificationType.TRANSFER_FAILED,
            data: notificationData,
            isRead: false,
        });
    }

    /**
     * Handle transfer status change and send appropriate notification
     */
    handleTransferStatusChange(
        transfer: Transfer,
        userId: string,
        previousStatus?: string
    ): Observable<any> {
        switch (transfer.status) {
            case 'APPROVED':
                return this.sendTransferApprovedNotification(transfer, userId);
            case 'REJECTED':
                return this.sendTransferRejectedNotification(transfer, userId);
            case 'COMPLETED':
                return this.sendTransferCompletedNotification(transfer, userId);
            case 'FAILED':
                return this.sendTransferFailedNotification(transfer, userId);
            default:
                // If status is PENDING and it's a new transfer
                if (!previousStatus || previousStatus !== 'PENDING') {
                    return this.sendTransferCreatedNotification(
                        transfer,
                        userId
                    );
                }
                return of(null);
        }
    }

    /**
     * Example usage method that demonstrates how to integrate with transfer operations
     */
    notifyTransferCreated(
        transferData: {
            id: number;
            reference: string;
            amount: number;
            currency: string;
            beneficiaryName: string;
            beneficiaryRib: string;
            reason: string;
            senderName: string;
        },
        userId: string
    ): void {
        const transfer: Transfer = {
            id: transferData.id,
            reference: transferData.reference,
            amount: transferData.amount,
            currency: transferData.currency,
            beneficiary: {
                name: transferData.beneficiaryName,
                rib: transferData.beneficiaryRib,
            },
            reason: transferData.reason,
            status: 'PENDING',
            user: {
                fullName: transferData.senderName,
            },
            createdAt: new Date(),
        };

        this.sendTransferCreatedNotification(transfer, userId).subscribe({
            next: (notification) => {
                console.log('Transfer notification sent:', notification);
            },
            error: (error) => {
                console.error('Failed to send transfer notification:', error);
            },
        });
    }
}

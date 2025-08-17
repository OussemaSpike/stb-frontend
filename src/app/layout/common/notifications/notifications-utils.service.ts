import { Injectable } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface TransferData {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    beneficiary: {
        name: string;
        rib: string;
    };
    reason: string;
    status: string;
    user: {
        fullName: string;
    };
    createdAt: Date;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationUtilsService {
    /**
     * Creates notification data for transfer notifications
     * Mimics the Spring Boot service structure
     */
    createTransferNotificationData(
        transfer: TransferData
    ): Record<string, any> {
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
     * Formats currency amount for display
     */
    formatCurrency(amount: string | number, currency: string): string {
        const numericAmount =
            typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency,
        }).format(numericAmount);
    }

    /**
     * Formats date for display
     */
    formatDate(date: Date | string): string {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, 'dd MMMM yyyy à HH:mm', { locale: fr });
    }

    /**
     * Gets notification title based on type
     */
    getNotificationTitle(type: string): string {
        const titles = {
            NEW_TRANSFER_CREATED: 'Nouveau virement créé',
            TRANSFER_APPROVED: 'Virement approuvé',
            TRANSFER_REJECTED: 'Virement rejeté',
            TRANSFER_COMPLETED: 'Virement terminé',
            TRANSFER_FAILED: 'Virement échoué',
        };
        return titles[type] || 'Notification';
    }

    /**
     * Gets notification icon based on type
     */
    getNotificationIcon(type: string): { icon: string; color: string } {
        const icons = {
            NEW_TRANSFER_CREATED: {
                icon: 'heroicons_solid:plus-circle',
                color: 'text-blue-500',
            },
            TRANSFER_APPROVED: {
                icon: 'heroicons_solid:check-circle',
                color: 'text-green-500',
            },
            TRANSFER_REJECTED: {
                icon: 'heroicons_solid:x-circle',
                color: 'text-red-500',
            },
            TRANSFER_COMPLETED: {
                icon: 'heroicons_solid:check-badge',
                color: 'text-emerald-500',
            },
            TRANSFER_FAILED: {
                icon: 'heroicons_solid:exclamation-triangle',
                color: 'text-red-600',
            },
        };
        return (
            icons[type] || {
                icon: 'heroicons_outline:bell',
                color: 'text-gray-500',
            }
        );
    }

    /**
     * Gets status badge configuration
     */
    getStatusBadge(status: string): {
        label: string;
        bgColor: string;
        textColor: string;
    } {
        const statusMap = {
            PENDING: {
                label: 'En attente',
                bgColor: 'bg-yellow-100',
                textColor: 'text-yellow-800',
            },
            APPROVED: {
                label: 'Approuvé',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800',
            },
            REJECTED: {
                label: 'Rejeté',
                bgColor: 'bg-red-100',
                textColor: 'text-red-800',
            },
            COMPLETED: {
                label: 'Terminé',
                bgColor: 'bg-emerald-100',
                textColor: 'text-emerald-800',
            },
            FAILED: {
                label: 'Échec',
                bgColor: 'bg-red-100',
                textColor: 'text-red-800',
            },
            NEW_TRANSFER_CREATED: {
                label: "En attente d'approbation",
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-800',
            },
        };
        return (
            statusMap[status] || {
                label: status,
                bgColor: 'bg-gray-100',
                textColor: 'text-gray-800',
            }
        );
    }
}

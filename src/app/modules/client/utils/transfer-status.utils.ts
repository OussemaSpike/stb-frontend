import { TransferStatus } from '../models/transfer.model';

export class TransferStatusUtils {
    static getStatusText(status: TransferStatus): string {
        switch (status) {
            case TransferStatus.PENDING:
                return 'En attente';
            case TransferStatus.VALIDATED:
                return 'Validé';
            case TransferStatus.EXECUTED:
                return 'Exécuté';
            case TransferStatus.FAILED:
                return 'Échoué';
            case TransferStatus.CANCELLED:
                return 'Annulé';
            default:
                return status;
        }
    }

    static getStatusColor(status: TransferStatus): string {
        switch (status) {
            case TransferStatus.PENDING:
                return 'text-yellow-600';
            case TransferStatus.VALIDATED:
                return 'text-blue-600';
            case TransferStatus.EXECUTED:
                return 'text-green-600';
            case TransferStatus.FAILED:
                return 'text-red-600';
            case TransferStatus.CANCELLED:
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    }

    static getStatusIcon(status: TransferStatus): string {
        switch (status) {
            case TransferStatus.PENDING:
                return 'schedule';
            case TransferStatus.VALIDATED:
                return 'check_circle_outline';
            case TransferStatus.EXECUTED:
                return 'check_circle';
            case TransferStatus.FAILED:
                return 'error';
            case TransferStatus.CANCELLED:
                return 'cancel';
            default:
                return 'help';
        }
    }

    static getStatusChipClass(status: TransferStatus): string {
        switch (status) {
            case TransferStatus.PENDING:
                return 'bg-yellow-100 text-yellow-800';
            case TransferStatus.VALIDATED:
                return 'bg-blue-100 text-blue-800';
            case TransferStatus.EXECUTED:
                return 'bg-green-100 text-green-800';
            case TransferStatus.FAILED:
                return 'bg-red-100 text-red-800';
            case TransferStatus.CANCELLED:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }
}

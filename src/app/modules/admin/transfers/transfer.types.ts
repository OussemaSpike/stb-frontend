export interface Transfer {
    id: string;
    reference: string;
    fromAccountRib: string;
    beneficiaryName: string;
    beneficiaryRib: string;
    amount: number;
    currency: string;
    reason: string;
    status: TransferStatus;
    fees: number;
    totalAmount: number;
    createdAt: string;
    executionDate: string;
    rejectionReason?: string;
}

export enum TransferStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export const TRANSFER_STATUS_OPTIONS = [
    { key: TransferStatus.PENDING, displayName: 'En attente', color: 'amber' },
    { key: TransferStatus.COMPLETED, displayName: 'Terminé', color: 'green' },
    { key: TransferStatus.FAILED, displayName: 'Échoué', color: 'red' },
    { key: TransferStatus.CANCELLED, displayName: 'Annulé', color: 'gray' },
];

export interface TransferSearchParams {
    status?: TransferStatus;
    search?: string;
    beneficiaryName?: string;
    minAmount?: number;
    maxAmount?: number;
    startDate?: string;
    endDate?: string;
}

export interface ApproveTransferRequest {
    transferId: string;
    comment?: string;
}

export interface RejectTransferRequest {
    transferId: string;
    reason: string;
}

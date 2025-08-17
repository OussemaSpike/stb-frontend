export enum TransferStatus {
    PENDING = 'PENDING',
    VALIDATED = 'VALIDATED',
    EXECUTED = 'EXECUTED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export interface TransferDto {
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
    executionDate?: string;
    rejectionReason?: string;
}

export interface TransferSummaryDto {
    id: string;
    reference: string;
    beneficiaryName: string;
    amount: number;
    fees: number;
    totalAmount: number;
    estimatedExecutionTime: string;
}

export interface InitiateTransferRequest {
    beneficiaryId: string;
    amount: number;
    reason: string;
}

export interface ValidateTransferRequest {
    transferId: string;
    validationCode: string;
}

export interface TransferFilters {
    status?: TransferStatus;
    beneficiaryName?: string;
    minAmount?: number;
    maxAmount?: number;
    startDate?: string;
    endDate?: string;
}

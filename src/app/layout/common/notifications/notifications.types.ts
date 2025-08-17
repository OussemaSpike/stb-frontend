export interface Notification {
    id: string;
    userId: string;
    isRead: boolean;
    type:
        | 'COMPANY_REQUEST_STATUS_CHANGED'
        | 'USER_ONBOARDING_COMPLETED'
        | 'FOUNDATION_DOCUMENT_UPLOADED'
        | 'FOUNDATION_DOCUMENT_VALIDATED'
        | 'FOUNDATION_DOCUMENT_REJECTED'
        | 'NEW_TRANSFER_CREATED'
        | 'TRANSFER_APPROVED'
        | 'TRANSFER_REJECTED'
        | 'TRANSFER_COMPLETED'
        | 'TRANSFER_FAILED';
    data: Record<string, string | number | Date>;
    createdAt: Date;
    updatedAt: Date;
}

// Transfer notification data interface
export interface TransferNotificationData {
    transferId: string;
    reference: string;
    amount: string;
    currency: string;
    beneficiaryName: string;
    beneficiaryRib: string;
    reason: string;
    status: string;
    senderName: string;
    createdAt: Date;
    [key: string]: string | number | Date;
}

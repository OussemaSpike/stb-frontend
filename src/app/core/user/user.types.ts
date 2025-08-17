export interface User {
    id: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    cin: string;
    address?: string;
    branchCode?: string;
    bankAccount: BankAccount;
    enabled: boolean;
    emailVerified: boolean;
    accountLocked: boolean;
    roles: string[];
    createdAt: string;
    updatedAt: string;
}

export interface BankAccount {
    id: string;
    rib: string;
    accountType: BankAccountType;
    balance: string;
    availableBalance: string;
    currency: string;
    status: AccountStatus;
}
export enum BankAccountType {
    COMPTE_COURANT = 'COMPTE_COURANT',
    COMPTE_EPARGNE = 'COMPTE_EPARGNE',
    COMPTE_TERME = 'COMPTE_TERME',
    COMPTE_PROFESSIONNEL = 'COMPTE_PROFESSIONNEL',
    COMPTE_DEVISE = 'COMPTE_DEVISE',
}

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

export interface BankAccountTypeOption {
    key: BankAccountType;
    displayName: string;
}

export const BANK_ACCOUNT_TYPE_OPTIONS: BankAccountTypeOption[] = [
    { key: BankAccountType.COMPTE_COURANT, displayName: 'Compte Courant' },
    { key: BankAccountType.COMPTE_EPARGNE, displayName: "Compte d'Épargne" },
    { key: BankAccountType.COMPTE_TERME, displayName: 'Compte à Terme' },
    {
        key: BankAccountType.COMPTE_PROFESSIONNEL,
        displayName: 'Compte Professionnel',
    },
    { key: BankAccountType.COMPTE_DEVISE, displayName: 'Compte Devise' },
];

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    cin: string;
    email: string;
    branchCode: string;
    phone: string;
    accountType: BankAccountType;
}

export interface UpdateUserRequest {
    id: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    accountType?: BankAccountType;
    branchCode?: string;
}

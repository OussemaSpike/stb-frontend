export interface BeneficiaryDto {
    id: string;
    name: string;
    rib: string;
    isVerified: boolean;
    isActive: boolean;
}

export interface CreateBeneficiaryRequest {
    name: string;
    rib: string;
}

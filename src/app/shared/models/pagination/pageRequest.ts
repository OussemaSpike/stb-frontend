import { SortDirection } from '../common/enums';

export interface PageRequest {
    page: number;
    size: number;
    sort: string;
    search?: string;
    sortDirection: SortDirection;
    onboardingStatus?: string;
}

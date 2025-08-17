import { SortDirection } from '../common/enums';

export interface PaginationParams {
    page: number;
    size: number;
    sort: string;
    search: string;
    sortDirection: SortDirection;
}

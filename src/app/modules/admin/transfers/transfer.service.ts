import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_API_URL } from 'app/app.config';

import { Page, PageRequest } from 'app/shared/models';
import { Observable } from 'rxjs';
import {
    ApproveTransferRequest,
    RejectTransferRequest,
    Transfer,
    TransferSearchParams,
} from './transfer.types';

@Injectable({ providedIn: 'root' })
export class TransferService {
    private _httpClient = inject(HttpClient);
    private readonly API_URL = inject(APP_API_URL);

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all transfers with pagination and filters
     */
    getAllTransfers(
        pageRequest: PageRequest,
        searchParams?: TransferSearchParams
    ): Observable<Page<Transfer>> {
        let params = new HttpParams()
            .set('page', pageRequest.page.toString())
            .set('size', pageRequest.size.toString())
            .set('sort', pageRequest.sort)
            .set('sortDirection', pageRequest.sortDirection);

        if (pageRequest.search) {
            params = params.set('search', pageRequest.search);
        }

        if (searchParams?.status) {
            params = params.set('status', searchParams.status);
        }

        if (searchParams?.beneficiaryName) {
            params = params.set(
                'beneficiaryName',
                searchParams.beneficiaryName
            );
        }

        if (searchParams?.minAmount !== undefined) {
            params = params.set('minAmount', searchParams.minAmount.toString());
        }

        if (searchParams?.maxAmount !== undefined) {
            params = params.set('maxAmount', searchParams.maxAmount.toString());
        }

        if (searchParams?.startDate) {
            params = params.set('startDate', searchParams.startDate);
        }

        if (searchParams?.endDate) {
            params = params.set('endDate', searchParams.endDate);
        }

        return this._httpClient.get<Page<Transfer>>(
            `${this.API_URL}/admin/transfers`,
            { params }
        );
    }

    /**
     * Get pending transfers
     */
    getPendingTransfers(): Observable<Transfer[]> {
        return this._httpClient.get<Transfer[]>(
            `${this.API_URL}/admin/transfers/pending`
        );
    }

    /**
     * Get transfer by ID
     */
    getTransferById(id: string): Observable<Transfer> {
        return this._httpClient.get<Transfer>(
            `${this.API_URL}/admin/transfers/${id}`
        );
    }

    /**
     * Approve a transfer
     */
    approveTransfer(request: ApproveTransferRequest): Observable<Transfer> {
        const params = request.comment
            ? new HttpParams().set('comment', request.comment)
            : new HttpParams();

        return this._httpClient.post<Transfer>(
            `${this.API_URL}/admin/transfers/${request.transferId}/approve`,
            {},
            { params }
        );
    }

    /**
     * Reject a transfer
     */
    rejectTransfer(request: RejectTransferRequest): Observable<Transfer> {
        const params = new HttpParams().set('reason', request.reason);

        return this._httpClient.post<Transfer>(
            `${this.API_URL}/admin/transfers/${request.transferId}/reject`,
            {},
            { params }
        );
    }
}

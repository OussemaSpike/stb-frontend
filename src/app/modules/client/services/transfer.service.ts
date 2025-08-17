import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_API_URL } from 'app/app.config';
import { Page } from 'app/shared/models/pagination/page-response.types';
import { Observable } from 'rxjs';
import {
    InitiateTransferRequest,
    TransferDto,
    TransferFilters,
    TransferSummaryDto,
    ValidateTransferRequest,
} from '../models/transfer.model';

@Injectable({
    providedIn: 'root',
})
export class TransferService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = inject(APP_API_URL);

    /**
     * Initier un nouveau transfert
     */
    initiateTransfer(
        request: InitiateTransferRequest
    ): Observable<TransferSummaryDto> {
        return this.http.post<TransferSummaryDto>(
            `${this.apiUrl}/transfers/initiate`,
            request
        );
    }

    /**
     * Valider et exécuter un transfert
     */
    validateAndExecuteTransfer(
        request: ValidateTransferRequest
    ): Observable<TransferDto> {
        return this.http.post<TransferDto>(
            `${this.apiUrl}/transfers/validate`,
            request
        );
    }

    /**
     * Obtenir l'historique des transferts avec pagination et filtres
     */
    getUserTransfers(
        page: number = 0,
        size: number = 10,
        sort: string = 'createdAt',
        sortDirection: 'ASC' | 'DESC' = 'DESC',
        filters?: TransferFilters
    ): Observable<Page<TransferDto>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort)
            .set('sortDirection', sortDirection);

        if (filters) {
            if (filters.status) {
                params = params.set('status', filters.status);
            }
            if (filters.beneficiaryName) {
                params = params.set('beneficiaryName', filters.beneficiaryName);
            }
            if (filters.minAmount !== undefined) {
                params = params.set('minAmount', filters.minAmount.toString());
            }
            if (filters.maxAmount !== undefined) {
                params = params.set('maxAmount', filters.maxAmount.toString());
            }
            if (filters.startDate) {
                params = params.set('startDate', filters.startDate);
            }
            if (filters.endDate) {
                params = params.set('endDate', filters.endDate);
            }
        }

        return this.http.get<Page<TransferDto>>(`${this.apiUrl}/transfers`, {
            params,
        });
    }

    /**
     * Obtenir un transfert par ID
     */
    getTransferById(transferId: string): Observable<TransferDto> {
        return this.http.get<TransferDto>(
            `${this.apiUrl}/transfers/${transferId}`
        );
    }

    /**
     * Vérifier la limite quotidienne
     */
    checkDailyLimit(amount: number): Observable<boolean> {
        const params = new HttpParams().set('amount', amount.toString());
        return this.http.get<boolean>(`${this.apiUrl}/transfers/limits/daily`, {
            params,
        });
    }

    /**
     * Vérifier la limite mensuelle
     */
    checkMonthlyLimit(amount: number): Observable<boolean> {
        const params = new HttpParams().set('amount', amount.toString());
        return this.http.get<boolean>(
            `${this.apiUrl}/transfers/limits/monthly`,
            { params }
        );
    }
}

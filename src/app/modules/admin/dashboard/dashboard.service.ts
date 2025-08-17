import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
    DashboardStats,
    MonthlyComparison,
    TopBeneficiary,
    TransferChartData,
    TransferStatusStats,
} from './dashboard.types';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private _httpClient = inject(HttpClient);
    private _apiUrl = 'http://localhost:8080/admin/dashboard';

    /**
     * Get comprehensive dashboard statistics
     */
    getDashboardStats(): Observable<DashboardStats> {
        return this._httpClient.get<DashboardStats>(`${this._apiUrl}/stats`);
    }

    /**
     * Get transfer chart data for the specified number of days
     */
    getTransferChartData(days: number = 30): Observable<TransferChartData[]> {
        return this._httpClient.get<TransferChartData[]>(
            `${this._apiUrl}/charts/transfers?days=${days}`
        );
    }

    /**
     * Get transfer status distribution statistics
     */
    getTransferStatusStats(): Observable<TransferStatusStats[]> {
        return this._httpClient.get<TransferStatusStats[]>(
            `${this._apiUrl}/charts/transfer-status`
        );
    }

    /**
     * Get top beneficiaries with their transfer counts and amounts
     */
    getTopBeneficiaries(limit: number = 10): Observable<TopBeneficiary[]> {
        return this._httpClient.get<TopBeneficiary[]>(
            `${this._apiUrl}/charts/top-beneficiaries?limit=${limit}`
        );
    }

    /**
     * Get monthly comparison data
     */
    getMonthlyComparison(): Observable<MonthlyComparison> {
        return this._httpClient.get<MonthlyComparison>(
            `${this._apiUrl}/comparison/monthly`
        );
    }

    /**
     * Get weekly transfer trends (last 7 days)
     */
    getWeeklyTrend(): Observable<TransferChartData[]> {
        return this._httpClient.get<TransferChartData[]>(
            `${this._apiUrl}/charts/weekly-trend`
        );
    }

    /**
     * Get yearly overview (last 365 days)
     */
    getYearlyOverview(): Observable<TransferChartData[]> {
        return this._httpClient.get<TransferChartData[]>(
            `${this._apiUrl}/charts/yearly-overview`
        );
    }
}

import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DashboardService } from './dashboard.service';
import {
    DashboardStats,
    MonthlyComparison,
    TopBeneficiary,
    TransferChartData,
    TransferStatusStats,
} from './dashboard.types';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
    ],
})
export class AdminDashboardComponent implements OnInit {
    private _dashboardService = inject(DashboardService);

    // Loading states
    isLoading = signal(true);
    isLoadingCharts = signal(false);

    // Data signals
    stats = signal<DashboardStats | null>(null);
    transferChartData = signal<TransferChartData[]>([]);
    statusStats = signal<TransferStatusStats[]>([]);
    topBeneficiaries = signal<TopBeneficiary[]>([]);
    monthlyComparison = signal<MonthlyComparison | null>(null);

    // Selected chart period
    selectedPeriod = signal<number>(30);

    // Computed values
    userGrowth = computed(() => {
        const statsData = this.stats();
        if (!statsData) return 0;

        const total = statsData.totalUsers;
        const active = statsData.activeUsers;
        return total > 0 ? (active / total) * 100 : 0;
    });

    transferGrowth = computed(() => {
        const comparison = this.monthlyComparison();
        return comparison?.transferGrowthPercentage || 0;
    });

    amountGrowth = computed(() => {
        const comparison = this.monthlyComparison();
        return comparison?.amountGrowthPercentage || 0;
    });

    ngOnInit(): void {
        this.loadDashboardData();
    }

    private loadDashboardData(): void {
        this.isLoading.set(true);

        forkJoin({
            stats: this._dashboardService.getDashboardStats(),
            chartData: this._dashboardService.getTransferChartData(
                this.selectedPeriod()
            ),
            statusStats: this._dashboardService.getTransferStatusStats(),
            topBeneficiaries: this._dashboardService.getTopBeneficiaries(10),
            monthlyComparison: this._dashboardService.getMonthlyComparison(),
        }).subscribe({
            next: (data) => {
                this.stats.set(data.stats);
                this.transferChartData.set(data.chartData);
                this.statusStats.set(data.statusStats);
                this.topBeneficiaries.set(data.topBeneficiaries);
                this.monthlyComparison.set(data.monthlyComparison);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error loading dashboard data:', error);
                this.isLoading.set(false);
            },
        });
    }

    onPeriodChange(days: number): void {
        this.selectedPeriod.set(days);
        this.loadChartData();
    }

    private loadChartData(): void {
        this.isLoadingCharts.set(true);

        this._dashboardService
            .getTransferChartData(this.selectedPeriod())
            .subscribe({
                next: (data) => {
                    this.transferChartData.set(data);
                    this.isLoadingCharts.set(false);
                },
                error: (error) => {
                    console.error('Error loading chart data:', error);
                    this.isLoadingCharts.set(false);
                },
            });
    }

    refreshData(): void {
        this.loadDashboardData();
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'COMPLETED':
                return 'text-green-600';
            case 'PENDING':
                return 'text-yellow-600';
            case 'APPROVED':
                return 'text-blue-600';
            case 'REJECTED':
                return 'text-red-600';
            case 'FAILED':
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    }

    getStatusIcon(status: string): string {
        switch (status) {
            case 'COMPLETED':
                return 'check_circle';
            case 'PENDING':
                return 'schedule';
            case 'APPROVED':
                return 'thumb_up';
            case 'REJECTED':
                return 'thumb_down';
            case 'FAILED':
                return 'error';
            default:
                return 'help';
        }
    }

    getGrowthIcon(percentage: number): string {
        return percentage >= 0 ? 'trending_up' : 'trending_down';
    }

    getGrowthColor(percentage: number): string {
        return percentage >= 0 ? 'text-green-600' : 'text-red-600';
    }
}

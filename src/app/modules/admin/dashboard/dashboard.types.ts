export interface DashboardStats {
    // General statistics
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;

    // Transfer statistics
    totalTransfers: number;
    pendingTransfers: number;
    completedTransfers: number;
    rejectedTransfers: number;
    failedTransfers: number;

    // Amount statistics
    totalAmountTransferred: number;
    totalAmountPending: number;
    averageTransferAmount: number;

    // Today's statistics
    todayTransfers: number;
    todayAmount: number;

    // This month statistics
    monthTransfers: number;
    monthAmount: number;

    // Performance metrics
    approvalRate: number;
    rejectionRate: number;
    failureRate: number;
}

export interface TransferChartData {
    date: string;
    count: number;
    amount: number;
}

export interface TransferStatusStats {
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'FAILED';
    count: number;
    percentage: number;
}

export interface TopBeneficiary {
    beneficiaryName: string;
    beneficiaryRib: string;
    transferCount: number;
    totalAmount: number;
}

export interface MonthlyComparison {
    currentMonthTransfers: number;
    currentMonthAmount: number;
    previousMonthTransfers: number;
    previousMonthAmount: number;
    transferGrowthPercentage: number;
    amountGrowthPercentage: number;
}

import { Routes } from '@angular/router';
import { BeneficiariesComponent } from './beneficiaries/beneficiaries.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { TransferHistoryComponent } from './transfer-history/transfer-history.component';
import { TransfersComponent } from './transfers/transfers.component';

export default [
    {
        path: 'dashboard',
        component: ClientDashboardComponent,
    },
    {
        path: 'beneficiaries',
        component: BeneficiariesComponent,
    },
    {
        path: 'transfers',
        component: TransfersComponent,
    },
    {
        path: 'history',
        component: TransferHistoryComponent,
    },
    {
        path: 'settings',
        component: SettingsComponent,
    },
] as Routes;

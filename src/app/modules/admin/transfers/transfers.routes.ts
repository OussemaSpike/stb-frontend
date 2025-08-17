import { Routes } from '@angular/router';
import { TransferDetailsComponent } from './transfer-details/transfer-details.component';
import { TransfersComponent } from './transfers.component';

export default [
    {
        path: '',
        component: TransfersComponent,
    },
    {
        path: 'details/:id',
        component: TransferDetailsComponent,
    },
] as Routes;

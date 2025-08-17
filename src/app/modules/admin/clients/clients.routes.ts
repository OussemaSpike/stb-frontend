import { Routes } from '@angular/router';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientsComponent } from './clients.component';

export default [
    {
        path: '',
        component: ClientsComponent,
    },
    {
        path: 'details/:id',
        component: ClientDetailsComponent,
    },
] as Routes;

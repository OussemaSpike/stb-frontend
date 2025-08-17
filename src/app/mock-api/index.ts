import { inject, Injectable } from '@angular/core';

import { NavigationMockApi } from 'app/core/navigation/api';

@Injectable({ providedIn: 'root' })
export class MockApiService {
    navigationMockApi = inject(NavigationMockApi);
}

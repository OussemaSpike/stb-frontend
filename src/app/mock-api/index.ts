import { inject, Injectable } from '@angular/core';

import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';

import { UserMockApi } from 'app/mock-api/common/user/api';

@Injectable({ providedIn: 'root' })
export class MockApiService {
    authMockApi = inject(AuthMockApi);

    navigationMockApi = inject(NavigationMockApi);
    notificationsMockApi = inject(NotificationsMockApi);
    userMockApi = inject(UserMockApi);
}

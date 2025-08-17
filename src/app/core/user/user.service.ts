import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_API_URL } from 'app/app.config';

import { Page, PageRequest, Role } from 'app/shared/models';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { CreateUserRequest, UpdateUserRequest, User } from './user.types';

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private readonly API_URL = inject(APP_API_URL);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(): Observable<User> {
        return this._httpClient.get<User>(`${this.API_URL}/users/me`).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    getUsersByRole(
        role: Role,
        pageRequest: PageRequest
    ): Observable<Page<User>> {
        const params = new HttpParams()
            .set('size', pageRequest.size)
            .set('page', pageRequest.page)
            .set('sort', pageRequest.sort)
            .set('search', pageRequest.search)
            .set('sortDirection', pageRequest.sortDirection)
            .set('role', role);

        return this._httpClient.get<Page<User>>(`${this.API_URL}/users`, {
            params,
        });
    }

    deleteById(id: string): Observable<void> {
        return this._httpClient.delete<void>(`${this.API_URL}/users/${id}`);
    }

    createUser(request: CreateUserRequest): Observable<User> {
        return this._httpClient.post<User>(`${this.API_URL}/users`, request);
    }

    updateUser(request: UpdateUserRequest): Observable<User> {
        return this._httpClient.put<User>(`${this.API_URL}/users`, request);
    }

    checkEmailExists(email: string): Observable<boolean> {
        return this._httpClient.get<boolean>(
            `${this.API_URL}/users/email-exists`,
            {
                params: { email },
            }
        );
    }

    getUserDetails(id: string): Observable<User> {
        return this._httpClient.get<User>(
            `${this.API_URL}/users/details/${id}`
        );
    }

    /**
     * Enable a client account (admin only)
     */
    enableClient(id: string): Observable<User> {
        return this._httpClient.post<User>(
            `${this.API_URL}/users/${id}/enable`,
            {}
        );
    }

    /**
     * Disable a client account (admin only)
     */
    disableClient(id: string): Observable<User> {
        return this._httpClient.post<User>(
            `${this.API_URL}/users/${id}/disable`,
            {}
        );
    }

    /**
     * Update current user's profile
     */
    updateProfile(request: UpdateProfileRequest): Observable<User> {
        return this._httpClient
            .put<User>(`${this.API_URL}/users/profile`, request)
            .pipe(
                tap((user) => {
                    this._user.next(user);
                })
            );
    }

    /**
     * Change password
     */
    changePassword(request: ChangePasswordRequest): Observable<void> {
        return this._httpClient.post<void>(
            `${this.API_URL}/auth/change-password`,
            request
        );
    }
}

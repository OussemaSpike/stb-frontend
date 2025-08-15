import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_API_URL } from 'app/app.config';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { User } from '../user/user.types';
import {
    ChangePassword,
    ResetPasswordRequest,
    SetPasswordRequest,
    SignInRequest,
    TokenResponse,
} from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private readonly API_URL = inject(APP_API_URL);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<unknown> {
        return this._httpClient.post(
            `${this.API_URL}/auth/forget-password`,
            {},
            {
                params: { email },
            }
        );
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(request: ResetPasswordRequest): Observable<unknown> {
        return this._httpClient.post(
            `${this.API_URL}/auth/reset-password`,
            request
        );
    }

    /**
     * Set password (For admins)
     */
    setPassword(request: SetPasswordRequest): Observable<unknown> {
        return this._httpClient.post(
            `${this.API_URL}/auth/set-password`,
            request
        );
    }

    /**
     * Logged in user change password
     */
    changePassword(request: ChangePassword): Observable<unknown> {
        return this._httpClient.post(
            `${this.API_URL}/auth/change-password`,
            request
        );
    }

    /**
     * Activate account
     * @param code
     */
    activateAccount(code: string): Observable<unknown> {
        return this._httpClient.post(
            `${this.API_URL}/auth/activate-account/${code}`,
            {}
        );
    }

    /**
     * Resend activation code email
     */
    resendActivationCodeEmail(code: string): Observable<unknown> {
        return this._httpClient.post(
            `${this.API_URL}/auth/send-activation-code`,
            {},
            {
                params: { code },
            }
        );
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: SignInRequest): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError(() => new Error('User is already logged in.'));
        }

        return this._httpClient
            .post(`${this.API_URL}/auth/login`, credentials)
            .pipe(
                switchMap((response: TokenResponse) => {
                    // Store the access token in the local storage
                    this.accessToken = response.accessToken;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // // Store the user on the user service
                    // this._userService.user = response.user;

                    // Return a new observable with the response
                    return of(response);
                })
            );
    }

    getUser(): Observable<boolean> {
        return this._httpClient.get(`${this.API_URL}/users/me`).pipe(
            switchMap((user: User) => {
                this._userService.user = user;
                console.log(user);
                this._authenticated = true;
                return of(true);
            }),
            catchError(() => of(false))
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.getUser();
    }
}

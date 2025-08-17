import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { Page } from 'app/shared/models';
import { map, Observable } from 'rxjs';
import { APP_API_URL } from '../../../app.config';
import { Notification } from './notifications.types';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _notifications = signal<Notification[]>([]);

    private readonly API_URL = `${inject(APP_API_URL)}/notifications`;

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    readonly notifications = computed(() => this._notifications());

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    addNotification(notification: Notification): void {
        this._notifications.set([notification, ...this._notifications()]);
    }
    removeNotificationById(id: string): void {
        this._notifications.set(
            this._notifications().filter((item) => item.id !== id)
        );
    }
    /**
     * Get all notifications
     */
    getAllPaginated(page: number): Observable<Page<Notification>> {
        return this._httpClient
            .get<Page<Notification>>(`${this.API_URL}/page`, {
                params: {
                    page,
                },
            })
            .pipe(
                map((notifications) => {
                    this._notifications.set([
                        ...this.notifications(),
                        ...notifications.content,
                    ]);
                    return notifications;
                })
            );
    }

    /**
     * Get all notifications
     */
    getAll(page: number): Observable<Notification[]> {
        return this._httpClient
            .get<Notification[]>(`${this.API_URL}`, {
                params: {
                    page,
                },
            })
            .pipe(
                map((notifications) => {
                    this._notifications.set([
                        ...this.notifications(),
                        ...notifications,
                    ]);
                    return notifications;
                })
            );
    }

    getUnreadCount(): Observable<number> {
        return this._httpClient.get<number>(`${this.API_URL}/unread-count`);
    }

    /**
     * Create a new notification
     */
    create(notification: Partial<Notification>): Observable<Notification> {
        return this._httpClient
            .post<Notification>(`${this.API_URL}`, notification)
            .pipe(
                map((newNotification: Notification) => {
                    this._notifications.update((notifications) => [
                        newNotification,
                        ...notifications,
                    ]);
                    return newNotification;
                })
            );
    }

    /**
     * Update the notification
     *
     * @param id
     * @param notification
     */
    markAsRead(id: string): Observable<Notification> {
        return this._httpClient
            .patch<Notification>(`${this.API_URL}/${id}`, {})
            .pipe(
                map((updatedNotification: Notification) => {
                    this._notifications.update((notifications) => {
                        return notifications.map((item) =>
                            item.id === id ? { ...item, isRead: true } : item
                        );
                    });

                    // Return the updated notification
                    return updatedNotification;
                })
            );
    }

    /**
     * Delete the notification
     *
     * @param id
     */
    deleteById(id: string): Observable<boolean> {
        return this._httpClient.delete<boolean>(`${this.API_URL}/${id}`).pipe(
            map((isDeleted: boolean) => {
                this._notifications.update((notifications) =>
                    notifications.filter((item) => item.id !== id)
                );

                return isDeleted;
            })
        );
    }

    clearAll(): Observable<boolean> {
        return this._httpClient.delete<boolean>(`${this.API_URL}`).pipe(
            map((isDeleted: boolean) => {
                this._notifications.set([]);
                return isDeleted;
            })
        );
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): Observable<boolean> {
        return this._httpClient.patch<boolean>(`${this.API_URL}`, {}).pipe(
            map((isUpdated: boolean) => {
                this._notifications.update((notifications) => {
                    return notifications.map((item) => ({
                        ...item,
                        isRead: true,
                    }));
                });
                return isUpdated;
            })
        );
    }
}

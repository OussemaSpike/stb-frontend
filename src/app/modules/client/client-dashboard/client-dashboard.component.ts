import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { AccountStatus, BankAccountType, User } from 'app/core/user/user.types';
import { BeneficiaryDto } from '../models/beneficiary.model';
import { TransferDto, TransferStatus } from '../models/transfer.model';
import { BeneficiaryService } from '../services/beneficiary.service';
import { TransferService } from '../services/transfer.service';

@Component({
    selector: 'app-client-dashboard',
    templateUrl: './client-dashboard.component.html',
    styleUrls: ['./client-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatChipsModule,
        MatProgressBarModule,
    ],
})
export class ClientDashboardComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly beneficiaryService = inject(BeneficiaryService);
    private readonly transferService = inject(TransferService);

    currentUser = signal<User | null>(null);
    beneficiariesCount = signal<number>(0);
    recentTransfers = signal<TransferDto[]>([]);
    pendingTransfers = signal<TransferDto[]>([]);
    isLoading = signal<boolean>(true);
    accountStatsLoading = signal<boolean>(true);
    currentDate = new Date();

    ngOnInit(): void {
        this.loadDashboardData();
        this.loadUserData();
    }

    private loadUserData(): void {
        this.accountStatsLoading.set(true);
        this.userService.get().subscribe({
            next: (user: User) => {
                this.currentUser.set(user);
                this.accountStatsLoading.set(false);
            },
            error: () => {
                this.accountStatsLoading.set(false);
            },
        });
    }

    private loadDashboardData(): void {
        this.isLoading.set(true);

        // Charger le nombre de bénéficiaires
        this.beneficiaryService.getUserBeneficiaries().subscribe({
            next: (beneficiaries: BeneficiaryDto[]) => {
                this.beneficiariesCount.set(beneficiaries.length);
            },
        });

        // Charger les transferts récents
        this.transferService.getUserTransfers(0, 5).subscribe({
            next: (page) => {
                this.recentTransfers.set(page.content || []);
                this.isLoading.set(false);
            },
        });

        // Charger les transferts en attente
        this.transferService
            .getUserTransfers(0, 10, 'createdAt', 'DESC', {
                status: TransferStatus.PENDING,
            })
            .subscribe({
                next: (page) => {
                    this.pendingTransfers.set(page.content || []);
                },
            });
    }

    getStatusColor(status: TransferStatus): string {
        switch (status) {
            case TransferStatus.PENDING:
                return 'text-yellow-600';
            case TransferStatus.EXECUTED:
                return 'text-green-600';
            case TransferStatus.FAILED:
                return 'text-red-600';
            case TransferStatus.CANCELLED:
                return 'text-gray-600';
            default:
                return 'text-blue-600';
        }
    }

    getStatusText(status: TransferStatus): string {
        switch (status) {
            case TransferStatus.PENDING:
                return 'En attente';
            case TransferStatus.VALIDATED:
                return 'Validé';
            case TransferStatus.EXECUTED:
                return 'Exécuté';
            case TransferStatus.FAILED:
                return 'Échoué';
            case TransferStatus.CANCELLED:
                return 'Annulé';
            default:
                return status;
        }
    }

    getAccountTypeDisplayName(accountType: BankAccountType): string {
        switch (accountType) {
            case BankAccountType.COMPTE_COURANT:
                return 'Compte Courant';
            case BankAccountType.COMPTE_EPARGNE:
                return "Compte d'Épargne";
            case BankAccountType.COMPTE_TERME:
                return 'Compte à Terme';
            case BankAccountType.COMPTE_PROFESSIONNEL:
                return 'Compte Professionnel';
            case BankAccountType.COMPTE_DEVISE:
                return 'Compte Devise';
            default:
                return accountType;
        }
    }

    getAccountStatusColor(status: AccountStatus): string {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'SUSPENDED':
                return 'bg-yellow-100 text-yellow-800';
            case 'CLOSED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    getAccountStatusIcon(status: AccountStatus): string {
        switch (status) {
            case 'ACTIVE':
                return 'check_circle';
            case 'SUSPENDED':
                return 'pause_circle';
            case 'CLOSED':
                return 'cancel';
            default:
                return 'help';
        }
    }

    getAccountStatusText(status: AccountStatus): string {
        switch (status) {
            case 'ACTIVE':
                return 'Actif';
            case 'SUSPENDED':
                return 'Suspendu';
            case 'CLOSED':
                return 'Fermé';
            default:
                return status;
        }
    }

    formatRib(rib: string): string {
        // Format RIB as XXXX XXXX XXXX XXXX XXXX for better readability
        return rib.replace(/(.{4})/g, '$1 ').trim();
    }
}

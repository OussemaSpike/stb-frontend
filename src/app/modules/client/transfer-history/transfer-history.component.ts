import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { Page } from 'app/shared/models/pagination/page-response.types';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
    TransferDto,
    TransferFilters,
    TransferStatus,
} from '../models/transfer.model';
import { TransferService } from '../services/transfer.service';

@Component({
    selector: 'app-transfer-history',
    templateUrl: './transfer-history.component.html',
    styleUrls: ['./transfer-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MtxGridModule,
        MatChipsModule,
        MatDividerModule,
        MatExpansionModule,
    ],
})
export class TransferHistoryComponent implements OnInit {
    private readonly transferService = inject(TransferService);
    private readonly fb = inject(FormBuilder);

    transfers = signal<TransferDto[]>([]);
    totalElements = signal<number>(0);
    isLoading = signal<boolean>(true);
    currentPage = signal<number>(0);
    pageSize = signal<number>(10);
    pageSizeOptions = signal([5, 10, 20, 50]);

    searchInputControl = new FormControl('');
    filterForm: FormGroup;

    columns = signal<MtxGridColumn[]>([
        {
            header: 'Référence',
            field: 'reference',
            sortable: true,
            width: '120px',
        },
        {
            header: 'Bénéficiaire',
            field: 'beneficiaryName',
            sortable: true,
            formatter: (data: TransferDto) =>
                `${data.beneficiaryName} - ${data.beneficiaryRib}`,
        },
        {
            header: 'Montant',
            field: 'amount',
            sortable: true,
            formatter: (data: TransferDto) =>
                `${data.amount.toFixed(2)} ${data.currency}`,
        },
        {
            header: 'Frais',
            field: 'fees',
            sortable: true,
            formatter: (data: TransferDto) =>
                data.fees > 0
                    ? `${data.fees.toFixed(2)} ${data.currency}`
                    : 'Gratuit',
        },
        {
            header: 'Statut',
            field: 'status',
        },
        {
            header: 'Date de création',
            field: 'createdAt',
            type: 'date',
            sortable: true,
        },
    ]);

    // Status options for filter
    statusOptions = [
        { value: TransferStatus.PENDING, label: 'En attente' },
        { value: TransferStatus.VALIDATED, label: 'Validé' },
        { value: TransferStatus.EXECUTED, label: 'Exécuté' },
        { value: TransferStatus.FAILED, label: 'Échoué' },
        { value: TransferStatus.CANCELLED, label: 'Annulé' },
    ];

    constructor() {
        this.filterForm = this.fb.group({
            status: [''],
            beneficiaryName: [''],
            minAmount: [''],
            maxAmount: [''],
            startDate: [''],
            endDate: [''],
        });
    }

    ngOnInit(): void {
        this.loadTransfers();
        this.setupSearch();

        // Apply filters automatically
        this.filterForm.valueChanges.subscribe(() => {
            this.currentPage.set(0);
            this.loadTransfers();
        });
    }

    private setupSearch(): void {
        this.searchInputControl.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe((searchTerm) => {
                this.filterBeneficiaryName(searchTerm || '');
            });
    }

    private filterBeneficiaryName(searchTerm: string): void {
        this.filterForm.patchValue({ beneficiaryName: searchTerm });
    }

    loadTransfers(): void {
        this.isLoading.set(true);

        const filters: TransferFilters = {};
        const formValue = this.filterForm.value;

        // Construire les filtres
        if (formValue.status) filters.status = formValue.status;
        if (formValue.beneficiaryName?.trim())
            filters.beneficiaryName = formValue.beneficiaryName.trim();
        if (formValue.minAmount)
            filters.minAmount = parseFloat(formValue.minAmount);
        if (formValue.maxAmount)
            filters.maxAmount = parseFloat(formValue.maxAmount);
        if (formValue.startDate)
            filters.startDate = formValue.startDate.toISOString().split('T')[0];
        if (formValue.endDate)
            filters.endDate = formValue.endDate.toISOString().split('T')[0];

        this.transferService
            .getUserTransfers(
                this.currentPage(),
                this.pageSize(),
                'createdAt',
                'DESC',
                filters
            )
            .subscribe({
                next: (page: Page<TransferDto>) => {
                    this.transfers.set(page.content || []);
                    this.totalElements.set(page.totalElements || 0);
                    this.isLoading.set(false);
                },
                error: () => {
                    this.isLoading.set(false);
                },
            });
    }

    onPageEvent(event: any): void {
        this.currentPage.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
        this.loadTransfers();
    }

    onSortChange(sort: any): void {
        // Handle sorting if needed
        this.loadTransfers();
    }

    clearFilters(): void {
        this.filterForm.reset();
    }

    getStatusColor(status: TransferStatus): string {
        switch (status) {
            case TransferStatus.PENDING:
                return 'bg-yellow-100 text-yellow-800';
            case TransferStatus.VALIDATED:
                return 'bg-blue-100 text-blue-800';
            case TransferStatus.EXECUTED:
                return 'bg-green-100 text-green-800';
            case TransferStatus.FAILED:
                return 'bg-red-100 text-red-800';
            case TransferStatus.CANCELLED:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    getStatusIcon(status: TransferStatus): string {
        switch (status) {
            case TransferStatus.PENDING:
                return 'schedule';
            case TransferStatus.VALIDATED:
                return 'check_circle_outline';
            case TransferStatus.EXECUTED:
                return 'check_circle';
            case TransferStatus.FAILED:
                return 'error';
            case TransferStatus.CANCELLED:
                return 'cancel';
            default:
                return 'help';
        }
    }

    getStatusText(status: TransferStatus): string {
        const option = this.statusOptions.find((s) => s.value === status);
        return option?.label || status;
    }

    viewTransferDetails(transfer: TransferDto): void {
        // Navigate to transfer details or show in a dialog
        console.log('View transfer details:', transfer);
    }
}

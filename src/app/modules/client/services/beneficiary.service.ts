import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_API_URL } from 'app/app.config';
import { Observable } from 'rxjs';
import {
    BeneficiaryDto,
    CreateBeneficiaryRequest,
} from '../models/beneficiary.model';

@Injectable({
    providedIn: 'root',
})
export class BeneficiaryService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = inject(APP_API_URL);

    /**
     * Créer un nouveau bénéficiaire
     */
    createBeneficiary(
        request: CreateBeneficiaryRequest
    ): Observable<BeneficiaryDto> {
        return this.http.post<BeneficiaryDto>(
            `${this.apiUrl}/beneficiaries`,
            request
        );
    }

    /**
     * Obtenir tous les bénéficiaires de l'utilisateur
     */
    getUserBeneficiaries(): Observable<BeneficiaryDto[]> {
        return this.http.get<BeneficiaryDto[]>(`${this.apiUrl}/beneficiaries`);
    }

    /**
     * Obtenir un bénéficiaire par ID
     */
    getBeneficiaryById(beneficiaryId: string): Observable<BeneficiaryDto> {
        return this.http.get<BeneficiaryDto>(
            `${this.apiUrl}/beneficiaries/${beneficiaryId}`
        );
    }

    /**
     * Supprimer un bénéficiaire
     */
    deleteBeneficiary(beneficiaryId: string): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/beneficiaries/${beneficiaryId}`
        );
    }
}

export class ValidationMessages {
    static required(fieldName: string): string {
        const fieldTranslations: Record<string, string> = {
            name: 'Le nom',
            rib: 'Le RIB',
            beneficiaryId: 'Le bénéficiaire',
            amount: 'Le montant',
            reason: 'Le motif',
            validationCode: 'Le code de validation',
        };

        return `${fieldTranslations[fieldName] || 'Ce champ'} est requis`;
    }

    static pattern(fieldName: string): string {
        if (fieldName === 'rib') {
            return 'Le RIB doit contenir exactement 20 chiffres';
        }
        return 'Format invalide';
    }

    static min(fieldName: string, min: number): string {
        if (fieldName === 'amount') {
            return `Le montant doit être supérieur à ${min}`;
        }
        return `La valeur doit être supérieure à ${min}`;
    }

    static max(fieldName: string, max: number): string {
        if (fieldName === 'amount') {
            if (max >= 1000000) {
                return 'Le montant ne peut pas dépasser 1,000,000';
            }
            return `Le montant ne peut pas dépasser ${max}`;
        }
        return `La valeur ne peut pas dépasser ${max}`;
    }

    static maxLength(fieldName: string, maxLength: number): string {
        const fieldTranslations: Record<string, string> = {
            name: 'Le nom',
            reason: 'Le motif',
        };

        return `${fieldTranslations[fieldName] || 'Ce champ'} ne doit pas dépasser ${maxLength} caractères`;
    }

    static getError(fieldName: string, errors: any): string {
        if (!errors) return '';

        if (errors.required) {
            return this.required(fieldName);
        }
        if (errors.pattern) {
            return this.pattern(fieldName);
        }
        if (errors.min) {
            return this.min(fieldName, errors.min.min);
        }
        if (errors.max) {
            return this.max(fieldName, errors.max.max);
        }
        if (errors.maxlength) {
            return this.maxLength(fieldName, errors.maxlength.requiredLength);
        }

        return 'Erreur de validation';
    }
}

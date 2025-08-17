import { EnumOption } from '../models';

export interface StatusColorInfo {
    backgroundClass: string;
    textClass: string;
}

/**
 * Get CSS classes for foundation step status display
 */
export function getFoundationStepStatusClasses(
    status: EnumOption | null | undefined
): StatusColorInfo {
    if (!status?.key) {
        return {
            backgroundClass: 'bg-gray-100',
            textClass: 'text-gray-800',
        };
    }

    switch (status.key) {
        case 'COMPLETED':
            return {
                backgroundClass: 'bg-green-100',
                textClass: 'text-green-800',
            };
        case 'BLOCKED':
            return {
                backgroundClass: 'bg-red-100',
                textClass: 'text-red-800',
            };
        case 'IN_PROGRESS':
            return {
                backgroundClass: 'bg-blue-100',
                textClass: 'text-blue-800',
            };
        case 'WAITING_FOR_DOCUMENTS':
            return {
                backgroundClass: 'bg-amber-100',
                textClass: 'text-amber-800',
            };
        case 'PENDING':
        default:
            return {
                backgroundClass: 'bg-slate-100',
                textClass: 'text-slate-700',
            };
    }
}

/**
 * Get combined CSS classes string for foundation step status
 */
export function getFoundationStepStatusClassString(
    status: EnumOption | null | undefined
): string {
    const colors = getFoundationStepStatusClasses(status);
    return `${colors.backgroundClass} ${colors.textClass}`;
}

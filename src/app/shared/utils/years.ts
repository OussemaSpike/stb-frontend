import { signal, Signal } from '@angular/core';

export class YearsUtils {
    public static generateYears(startYear = 1900): Signal<number[]> {
        const currentYear = new Date().getFullYear();
        const years: number[] = [];

        for (let year = currentYear; year >= startYear; year--) {
            years.push(year);
        }

        return signal(years);
    }
}

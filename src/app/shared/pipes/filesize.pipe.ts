import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
    transform(sizeInBytes: number): string | null {
        // 5. Handle the zero case
        if (sizeInBytes === 0) return '0 Bytes';
        // 5a. Handle null or undefined input (though TypeScript expects number, JS might pass other things)
        if (sizeInBytes == null || isNaN(sizeInBytes)) return null; // Good practice to add

        const k = 1024; // Kilobyte (1024 bytes = 1 KB)
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
        // Ensure 'i' doesn't go out of bounds for the 'sizes' array
        const unitIndex = Math.min(i, sizes.length - 1);

        // 8. Calculate the value in the new unit and format it
        return (
            parseFloat((sizeInBytes / Math.pow(k, unitIndex)).toFixed(2)) + // Calculate, fix to 2 decimals, parse
            ' ' +
            sizes[unitIndex]
        );
    }
}

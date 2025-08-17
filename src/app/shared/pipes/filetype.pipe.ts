import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileType',
})
export class FileTypePipe implements PipeTransform {
    transform(contentType: string): string | null {
        const typeMap: { [key: string]: string } = {
            'application/pdf': 'PDF',
            'image/jpeg': 'JPEG',
            'image/png': 'PNG',
            'text/plain': 'Txt',
            'application/msword': 'Word',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                'Word',
            'application/vnd.ms-excel': 'Excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                'Excel',
        };

        return typeMap[contentType] || 'Unknown File Type';
    }
}

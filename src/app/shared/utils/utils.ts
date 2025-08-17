export interface Document {
    id: string;
    url: string;
    name: string;
    extension: string;
    size: number;
}
export class Utils {
    public static convertBytesToReadableString(sizeInBytes: number): string {
        // 5. Handle the zero case
        if (sizeInBytes === 0) return '0 Bytes';
        // 5a. Handle null or undefined input (though TypeScript expects number, JS might pass other things)
        if (sizeInBytes == null || isNaN(sizeInBytes)) return ''; // Good practice to add

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

    public static convertDocumentToFile(document: Document): File {
        const content = new Uint8Array(document?.size);
        const blob = new Blob([content], {
            type: this.getMimeType(document?.extension),
        });
        return new File([blob], document?.name, {
            type: this.getMimeType(document?.extension),
        });
    }

    public static getMimeType(extension: string): string {
        switch (extension) {
            case 'pdf':
                return 'application/pdf';
            case 'doc':
                return 'application/msword';
            case 'docx':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'ppt':
                return 'application/vnd.ms-powerpoint';
            case 'pptx':
                return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            default:
                return 'application/octet-stream';
        }
    }
}

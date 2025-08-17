/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HotToastService } from '@ngxpert/hot-toast';
import { FileSizePipe } from '../../pipes/filesize.pipe';
import { Utils } from '../../utils/utils';

/**
 * FileUploadComponent - A reusable Angular component for file uploading with drag & drop support
 *
 * This component provides a comprehensive file upload interface with the following features:
 * - Drag and drop file upload
 * - Click to upload functionality
 * - File type validation
 * - File size validation
 * - Preview support for images
 * - File type icons for different file formats
 * - Customizable preview layouts
 *
 * @example
 * Basic usage:
 * ```html
 * <lib-file-upload
 *   [type]="'file'"
 *   [accept]="'.pdf,.doc,.docx'"
 *   [maxFileSize]="5242880"
 *   (fileUploaded)="onFileUploaded($event)"
 *   (deletedFile)="onFileDeleted($event)">
 * </lib-file-upload>
 * ```
 *
 * @example
 * Image upload with circular preview:
 * ```html
 * <lib-file-upload
 *   [type]="'image'"
 *   [accept]="'image/*'"
 *   [previewLayout]="'circle'"
 *   [maxFileSize]="2097152"
 *   (fileUploaded)="onImageUploaded($event)">
 * </lib-file-upload>
 * ```
 *
 * @example
 * Component usage in TypeScript:
 * ```typescript
 * export class MyComponent {
 *   onFileUploaded(file: File): void {
 *     console.log('File uploaded:', file.name);
 *     console.log('File size:', file.size);
 *     console.log('File type:', file.type);
 *
 *     // Process the file (e.g., upload to server)
 *     this.uploadFileToServer(file);
 *   }
 *
 *   onFileDeleted(file: File): void {
 *     console.log('File deleted:', file.name);
 *     // Handle file deletion
 *   }
 *
 *   private uploadFileToServer(file: File): void {
 *     const formData = new FormData();
 *     formData.append('file', file);
 *
 *     this.httpClient.post('/api/upload', formData)
 *       .subscribe(response => {
 *         console.log('Upload successful', response);
 *       });
 *   }
 * }
 * ```
 *
 * @example
 * CSV file upload:
 * ```html
 * <lib-file-upload
 *   [type]="'csv'"
 *   [accept]="'.csv'"
 *   [maxFileSize]="10485760"
 *   (fileUploaded)="onCsvUploaded($event)">
 * </lib-file-upload>
 * ```
 */

/**
 * Defines the type of file upload component
 */
export type FileType = 'file' | 'image' | 'csv';

/**
 * Defines the preview layout for uploaded files
 */
export type PreviewLayout = 'circle' | 'rectangle';

@Component({
    selector: 'lib-file-upload',
    imports: [CommonModule, MatButtonModule, MatIconModule, FileSizePipe],
    templateUrl: './file-upload.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements OnInit {
    // -----------------------------------------------------------------------------------------------------
    // @ Dependencies
    // -----------------------------------------------------------------------------------------------------
    private readonly _toastService = inject(HotToastService);

    readonly fileInput =
        viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
    // -----------------------------------------------------------------------------------------------------
    // @ Inputs
    // -----------------------------------------------------------------------------------------------------
    readonly accept = input<string>('*/*'); // Accept all files by default
    readonly maxFileSize = input<number>(10485760); // 10 MB by default
    readonly type = input.required<FileType>();
    readonly previewLayout = input<PreviewLayout>('circle');

    // -----------------------------------------------------------------------------------------------------
    // @ Outputs
    // -----------------------------------------------------------------------------------------------------

    /** Event emitted when a file is successfully uploaded */
    readonly fileUploaded = output<File>();

    /** Event emitted when a file is deleted/removed */
    readonly deletedFile = output<File>();

    // -----------------------------------------------------------------------------------------------------
    // @ Signals and Observables
    // -----------------------------------------------------------------------------------------------------
    data = signal<any>(null);
    readonly isFileDragged = signal(false);
    readonly hasUrl = signal(false);
    readonly fileHasChanged = signal(false);
    readonly isLoading = signal(false);

    // -----------------------------------------------------------------------------------------------------
    // @ Public properties
    // -----------------------------------------------------------------------------------------------------
    file: File | null | undefined;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit() {
        if (this.data()) {
            this.file = Utils.convertDocumentToFile(this.data().document);
            this.hasUrl.set(true);
        }
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Handles file selection from input element or drag & drop
     * Validates file size and emits fileUploaded event if valid
     * @param event - The file input event
     * @param files - Optional files array for drag & drop
     */
    onFileSelected(event: Event, files?: FileList): void {
        let fileList: FileList | null = null;

        if (files) {
            // Called from drag & drop
            fileList = files;
        } else {
            // Called from input change event
            const input = event.target as HTMLInputElement;
            fileList = input.files;
        }

        if (fileList && fileList.length > 0) {
            if (fileList[0].size > this.maxFileSize()) {
                this._toastService.error(
                    `La taille du fichier ne peut pas dépasser ${this.convertBytes(this.maxFileSize())}`
                );
                return;
            }
            this.file = fileList[0];
            this.fileUploaded.emit(this.file);
        }
    }

    /**
     * Triggers the hidden file input when the upload button is clicked
     */
    onUploadButtonClick(): void {
        if (this.fileInput()) {
            this.fileInput().nativeElement.click();
        }
    }

    /**
     * Handles drag over event for drag & drop functionality
     * @param event - The drag event
     */
    onDragOver(event: DragEvent) {
        this.isFileDragged.set(true);
        event.preventDefault();
    }

    /**
     * Handles drag leave event for drag & drop functionality
     * @param event - The drag event
     */
    onDragLeave(event: DragEvent) {
        this.isFileDragged.set(false);
        event.preventDefault();
    }

    /**
     * Handles file drop event for drag & drop functionality
     * @param event - The drop event containing files
     */
    onDrop(event: DragEvent) {
        event.preventDefault();
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.onFileSelected(event, files);
        }
        this.isFileDragged.set(false);
    }

    /**
     * Converts bytes to a human-readable string format
     * @param bytes - Number of bytes to convert
     * @returns Human-readable string representation of file size
     */
    convertBytes(bytes: number): string {
        return Utils.convertBytesToReadableString(bytes);
    }

    /**
     * Removes the currently selected file and resets component state
     * Emits deletedFile event if a file was removed
     */
    removeFile() {
        this.hasUrl.set(false);
        this.file = null;
        if (this.data() && this.data().profilePicture !== undefined) {
            this.data().profilePicture = null;
        }
        if (this.file) {
            this.deletedFile.emit(this.file);
        }
    }

    /**
     * Gets a short string representation of the file type based on extension
     * @param fileName - The name of the file
     * @returns Short type string (e.g., 'PDF', 'DOC', 'JPG')
     */
    getShortType(fileName: string): string {
        const extension = fileName.split('.').pop()?.toLowerCase();
        const extensionTypeMap: Record<string, string> = {
            pdf: 'PDF',
            doc: 'DOC',
            docx: 'DOCX',
            xls: 'XLS',
            xlsx: 'XLSX',
            txt: 'TXT',
            jpg: 'JPG',
            jpeg: 'JPG',
            png: 'PNG',
            gif: 'GIF',
            bmp: 'BMP',
            webp: 'WEBP',
            csv: 'CSV',
            tsv: 'TSV',
        };

        return extension ? extensionTypeMap[extension] || 'UNKNOWN' : 'UNKNOWN';
    }

    /**
     * Gets the appropriate CSS class name for file type icon based on extension
     * @param fileName - The name of the file
     * @returns CSS class name for styling the file type icon
     */
    getFileTypeClassName(fileName: string): string {
        switch (fileName.split('.').pop()?.toLowerCase()) {
            case 'pdf':
                return 'bg-red-600';
            case 'doc':
            case 'docx':
                return 'bg-blue-600';
            case 'xls':
            case 'xlsx':
                return 'bg-green-600';
            case 'jpg':
            case 'jpeg':
                return 'bg-yellow-600';
            case 'png':
                return 'bg-blue-400';
            case 'txt':
                return 'bg-gray-600';
            default:
                return 'bg-gray-400';
        }
    }

    /**
     * Creates an object URL from a file for preview purposes
     * @param file - The file to create an object URL for
     * @returns Object URL string that can be used as src for images
     */
    createObjectURL(file: File): string {
        return URL.createObjectURL(file);
    }
}

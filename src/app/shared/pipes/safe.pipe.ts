import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safe',
})
export class SafeUrlPipe implements PipeTransform {
    readonly sanitizer = inject(DomSanitizer);

    transform(url: string): SafeResourceUrl | null {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

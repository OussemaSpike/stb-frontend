import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Observable, of } from 'rxjs';

@Pipe({
    name: 'ngTimeAgoPipe',
})
export class TimeAgoPipe implements PipeTransform {
    transform(date: Date | string): Observable<string> {
        if (!date) {
            return of('Invalid date');
        }

        return of(
            formatDistanceToNow(new Date(date), {
                addSuffix: true,
                locale: fr,
            })
        );
    }
}

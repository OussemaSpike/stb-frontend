import { debounceTime, distinctUntilChanged, filter, pipe } from 'rxjs';

export const searchInputFilter = (minLength = 2, debounce = 300) =>
    pipe(
        debounceTime(debounce),
        distinctUntilChanged(),
        filter((text: string) => text.length === 0 || text.length >= minLength)
    );

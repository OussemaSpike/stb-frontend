/**
 * A TypeScript type that represents the possible values of the `Theme` object.
 *
 * Explanation:
 * 1. `typeof Theme`: Gets the type of the `Theme` object, which is:
 *    ```typescript
 *    {
 *        readonly LIGHT: 'light';
 *        readonly DARK: 'dark';
 *    }
 *    ```
 *
 * 2. `keyof typeof Theme`: Extracts the keys of the `Theme` object as a union of string literals:
 *    ```typescript
 *    'LIGHT' | 'DARK'
 *    ```
 *
 * 3. `(typeof Theme)[keyof typeof Theme]`: Uses the keys (`'LIGHT' | 'DARK'`) to access the corresponding values in the `Theme` object:
 *    ```typescript
 *    'light' | 'dark'
 *    ```
 *
 * This type dynamically matches the values of the `Theme` object and ensures consistency.
 * If you add or change values in `Theme`, `ThemeType` will automatically update.
 */

export const SortDirectionEnum = {
    ASC: 'ASC',
    DESC: 'DESC',
} as const;
export type SortDirection =
    (typeof SortDirectionEnum)[keyof typeof SortDirectionEnum];

export const RoleEnum = {
    ADMIN: 'ADMIN',
    CLIENT: 'CLIENT',
} as const;
export type Role = (typeof RoleEnum)[keyof typeof RoleEnum];

export interface EnumOption {
    key: string;
    value: string;
}

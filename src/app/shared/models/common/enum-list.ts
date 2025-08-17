export interface EnumValueDto<T extends string> {
    name: T;
    translations: {
        fr: string;
        ar: string;
    };
}

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom pipe to format phone numbers
 * Transforms: 20123456 -> 20 123 456 (Tunisian format)
 */
@Pipe({
    name: 'phoneFormat',
    standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return '';

        // Remove all non-numeric characters
        const cleaned = ('' + value).replace(/\D/g, '');

        // Format based on length (8 digits for Tunisian numbers)
        if (cleaned.length === 8) {
            const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})$/);
            if (match) {
                return match[1] + ' ' + match[2] + ' ' + match[3];
            }
        }

        // Return original if doesn't match expected format
        return value;
    }
}

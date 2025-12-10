import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'phoneFormat',
    standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return '';

        const cleaned = ('' + value).replace(/\D/g, '');

        if (cleaned.length === 8) {
            const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})$/);
            if (match) {
                return match[1] + ' ' + match[2] + ' ' + match[3];
            }
        }

        return value;
    }
}

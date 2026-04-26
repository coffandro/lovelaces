export function formatDanishPhone(value: string): string {
    let digits = value.replace(/\D/g, '');

    if (digits.startsWith('45') && digits.length > 8) {
        digits = digits.slice(2);
    }

    digits = digits.slice(0, 8);

    if (digits.length === 0) {
        return '';
    }

    const groups = digits.match(/.{1,2}/g) ?? [];
    return `+45 ${groups.join(' ')}`;
}

export function normalizeDanishPhone(value: string): string | null {
    let digits = value.replace(/\D/g, '');

    if (digits.startsWith('45') && digits.length === 10) {
        digits = digits.slice(2);
    }

    if (digits.length !== 8) {
        return null;
    }

    return formatDanishPhone(digits);
}
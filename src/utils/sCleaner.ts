export function normalize(str: string): string {
    return str.replace(/\s+/g, ' ').trim();
}
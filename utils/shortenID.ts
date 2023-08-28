export function shortenID(id: string, maxLen?: number) {
    maxLen = maxLen || 16;
    if (id.length <= maxLen) return id;
    return id.substring(0, maxLen / 2) + '...' + id.substring(id.length - (maxLen / 2));
}

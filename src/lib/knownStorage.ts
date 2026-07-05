const STORAGE_KEY = 'safari-trasa.known.v1';

export function questionKey(place: string, question: string): string {
    return `${place}\u0000${question}`;
}

export function loadKnownSet(): Set<string> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return new Set();
        return new Set(parsed.filter((x): x is string => typeof x === 'string'));
    } catch {
        return new Set();
    }
}

export function saveKnownSet(known: Set<string>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...known]));
}

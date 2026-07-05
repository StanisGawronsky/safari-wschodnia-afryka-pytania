import { siteConfig } from '../config';

export function questionKey(topic: string, question: string): string {
    return `${topic}\u0000${question}`;
}

export function storageKey(): string {
    return siteConfig.storageKey;
}

export function loadKnownSet(): Set<string> {
    try {
        const raw = localStorage.getItem(storageKey());
        if (!raw) return new Set();
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return new Set();
        return new Set(parsed.filter((x): x is string => typeof x === 'string'));
    } catch {
        return new Set();
    }
}

export function saveKnownSet(known: Set<string>): void {
    localStorage.setItem(storageKey(), JSON.stringify([...known]));
}

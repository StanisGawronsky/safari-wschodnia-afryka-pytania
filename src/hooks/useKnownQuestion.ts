import { useSyncExternalStore } from 'react';
import { loadKnownSet, questionKey, saveKnownSet } from '../lib/knownStorage';

let knownCache = loadKnownSet();
const listeners = new Set<() => void>();

function emit() {
    listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return knownCache;
}

function toggleKnown(topic: string, question: string): void {
    const key = questionKey(topic, question);
    const next = new Set(knownCache);
    if (next.has(key)) {
        next.delete(key);
    } else {
        next.add(key);
    }
    knownCache = next;
    saveKnownSet(next);
    emit();
}

export function useKnownQuestion(topic: string, question: string) {
    const known = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    const key = questionKey(topic, question);
    return {
        isKnown: known.has(key),
        toggle: () => toggleKnown(topic, question),
    };
}

export function useKnownCount() {
    const known = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    return known.size;
}

export function useKnownSet() {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export type KnownFilter = 'all' | 'known' | 'unknown';

export type PlaceQuestions = {
    name: string;
    categories: Record<string, string[]>;
};

export function buildGoogleQuery(place: string, question: string): string {
    return `${place}; ${question}`;
}

export function openGoogleHint(place: string, question: string): void {
    const q = encodeURIComponent(buildGoogleQuery(place, question)).replace(/%20/g, '+');
    window.open(`https://www.google.com/search?q=${q}`, '_blank', 'noopener,noreferrer');
}

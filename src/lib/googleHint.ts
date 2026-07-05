import { siteConfig } from '../config';

export type TopicQuestions = {
    name: string;
    categories: Record<string, string[]>;
};

export function buildGoogleQuery(question: string): string {
    return `${siteConfig.domain}; ${question}`;
}

export function openGoogleHint(topic: string, question: string): void {
    void topic;
    const q = encodeURIComponent(buildGoogleQuery(question)).replace(/%20/g, '+');
    window.open(`https://www.google.com/search?q=${q}`, '_blank', 'noopener,noreferrer');
}

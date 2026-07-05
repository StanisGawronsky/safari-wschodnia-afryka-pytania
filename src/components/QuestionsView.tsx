import questionsData from '../data/questions.json';
import { useKnownQuestion, useKnownSet, type KnownFilter } from '../hooks/useKnownQuestion';
import { questionKey } from '../lib/knownStorage';
import { openGoogleHint, type TopicQuestions } from '../lib/googleHint';
import { KnownCheckbox } from './KnownCheckbox';

const questions = questionsData as TopicQuestions[];

export const TOTAL_QUESTIONS = questions.reduce(
    (sum, topic) => sum + Object.values(topic.categories).reduce((s, qs) => s + qs.length, 0),
    0,
);

export const TOPIC_NAMES = questions.map((t) => t.name);

type QuestionsViewProps = {
    focusTopicName?: string | null;
    knownFilter?: KnownFilter;
};

export function QuestionsView({ focusTopicName, knownFilter = 'all' }: QuestionsViewProps) {
    const knownSet = useKnownSet();

    const topics = focusTopicName ? questions.filter((t) => t.name === focusTopicName) : questions;

    const filteredTopics = topics
        .map((topic) => {
            const categories = Object.fromEntries(
                Object.entries(topic.categories)
                    .map(([category, items]) => {
                        const filtered = items.filter((question) => {
                            const isKnown = knownSet.has(questionKey(topic.name, question));
                            if (knownFilter === 'known') return isKnown;
                            if (knownFilter === 'unknown') return !isKnown;
                            return true;
                        });
                        return [category, filtered] as const;
                    })
                    .filter(([, items]) => items.length > 0),
            );
            return { ...topic, categories };
        })
        .filter((topic) => Object.keys(topic.categories).length > 0);

    if (filteredTopics.length === 0) {
        return (
            <p className="empty-state">
                {knownFilter === 'known' && 'Brak pytań oznaczonych jako „Umiem”.'}
                {knownFilter === 'unknown' && 'Gratulacje — wszystkie pytania oznaczone jako „Umiem”!'}
                {knownFilter === 'all' && 'Brak pytań dla wybranego filtra.'}
            </p>
        );
    }

    return (
        <div className="questions-view">
            {filteredTopics.map((topic) => (
                <section key={topic.name} id={slugify(topic.name)} className="topic-section">
                    <h2>{topic.name}</h2>
                    {Object.entries(topic.categories).map(([category, items]) => (
                        <div key={category} className="category-block">
                            <h3>{category}</h3>
                            <ol>
                                {items.map((question) => (
                                    <QuestionItem key={question} topic={topic.name} question={question} />
                                ))}
                            </ol>
                        </div>
                    ))}
                </section>
            ))}
        </div>
    );
}

function QuestionItem({ topic, question }: { topic: string; question: string }) {
    const { isKnown } = useKnownQuestion(topic, question);

    return (
        <li className={`question-item${isKnown ? ' question-item--known' : ''}`}>
            <span className="question-text">{question}</span>
            <div className="question-actions">
                <KnownCheckbox topic={topic} question={question} />
                <button
                    type="button"
                    className="question-hint-btn"
                    aria-label="Szukaj tego pytania w Google (nowa karta)"
                    title="Szukaj tego pytania w Google (nowa karta)"
                    onClick={() => openGoogleHint(topic, question)}
                >
                    <HintIcon />
                    <span>Podpowiedź</span>
                </button>
            </div>
        </li>
    );
}

function HintIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
            <text
                x="12"
                y="16.5"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="currentColor"
                fontFamily="system-ui, sans-serif"
            >
                ?
            </text>
        </svg>
    );
}

function slugify(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export function scrollToTopic(name: string): void {
    document.getElementById(slugify(name))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

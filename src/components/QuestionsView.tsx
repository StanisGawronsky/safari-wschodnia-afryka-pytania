import questionsData from '../data/questions.json';
import { useKnownQuestion, useKnownSet, type KnownFilter } from '../hooks/useKnownQuestion';
import { questionKey } from '../lib/knownStorage';
import { openGoogleHint, type PlaceQuestions } from '../lib/googleHint';
import { KnownCheckbox } from './KnownCheckbox';

const questions = questionsData as PlaceQuestions[];

export const TOTAL_QUESTIONS = questions.reduce(
    (sum, place) => sum + Object.values(place.categories).reduce((s, qs) => s + qs.length, 0),
    0,
);

type QuestionsViewProps = {
    focusPlaceName?: string | null;
    knownFilter?: KnownFilter;
};

export function QuestionsView({ focusPlaceName, knownFilter = 'all' }: QuestionsViewProps) {
    const knownSet = useKnownSet();

    const places = focusPlaceName ? questions.filter((p) => p.name === focusPlaceName) : questions;

    const filteredPlaces = places
        .map((place) => {
            const categories = Object.fromEntries(
                Object.entries(place.categories)
                    .map(([category, items]) => {
                        const filtered = items.filter((question) => {
                            const isKnown = knownSet.has(questionKey(place.name, question));
                            if (knownFilter === 'known') return isKnown;
                            if (knownFilter === 'unknown') return !isKnown;
                            return true;
                        });
                        return [category, filtered] as const;
                    })
                    .filter(([, items]) => items.length > 0),
            );
            return { ...place, categories };
        })
        .filter((place) => Object.keys(place.categories).length > 0);

    if (filteredPlaces.length === 0) {
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
            {filteredPlaces.map((place) => (
                <section key={place.name} id={slugify(place.name)} className="place-section">
                    <h2>{place.name}</h2>
                    {Object.entries(place.categories).map(([category, items]) => (
                        <div key={category} className="category-block">
                            <h3>{category}</h3>
                            <ol>
                                {items.map((question) => (
                                    <QuestionItem key={question} place={place.name} question={question} />
                                ))}
                            </ol>
                        </div>
                    ))}
                </section>
            ))}
        </div>
    );
}

function QuestionItem({ place, question }: { place: string; question: string }) {
    const { isKnown } = useKnownQuestion(place, question);

    return (
        <li className={`question-item${isKnown ? ' question-item--known' : ''}`}>
            <span className="question-text">{question}</span>
            <div className="question-actions">
                <KnownCheckbox place={place} question={question} />
                <button
                    type="button"
                    className="question-hint-btn"
                    aria-label="Szukaj tego pytania w Google (nowa karta)"
                    title="Szukaj tego pytania w Google (nowa karta)"
                    onClick={() => openGoogleHint(place, question)}
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

export function scrollToPlace(name: string): void {
    document.getElementById(slugify(name))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

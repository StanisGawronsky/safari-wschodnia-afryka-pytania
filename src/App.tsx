import { useState } from 'react';
import { siteConfig } from './config';
import { useKnownCount, type KnownFilter } from './hooks/useKnownQuestion';
import { QuestionsView, TOTAL_QUESTIONS, TOPIC_NAMES } from './components/QuestionsView';

const KNOWN_FILTER_OPTIONS: { value: KnownFilter; label: string }[] = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'known', label: 'Umiem' },
    { value: 'unknown', label: 'Do nauki' },
];

export function App() {
    const knownCount = useKnownCount();
    const [topicFilter, setTopicFilter] = useState<string | null>(null);
    const [knownFilter, setKnownFilter] = useState<KnownFilter>('all');

    return (
        <div className="app">
            <header className="app-header">
                <div>
                    <h1>{siteConfig.headerTitle}</h1>
                    <p className="app-subtitle">
                        {TOTAL_QUESTIONS} pytań UbD
                        {knownCount > 0 && (
                            <span className="known-progress">
                                {' '}
                                · umiem: {knownCount}/{TOTAL_QUESTIONS}
                            </span>
                        )}
                    </p>
                </div>
            </header>

            <div className="questions-panel">
                <div className="filter-bar">
                    <div className="filter-group">
                        <span className="filter-label">Status</span>
                        <div className="filter-pills" role="group" aria-label="Filtruj po statusie">
                            {KNOWN_FILTER_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className={`filter-pill filter-pill--${opt.value}${
                                        knownFilter === opt.value ? ' active' : ''
                                    }`}
                                    aria-pressed={knownFilter === opt.value}
                                    onClick={() => setKnownFilter(opt.value)}
                                >
                                    {opt.label}
                                    {opt.value === 'known' && knownCount > 0 && (
                                        <span className="filter-pill__count">{knownCount}</span>
                                    )}
                                    {opt.value === 'unknown' && (
                                        <span className="filter-pill__count">{TOTAL_QUESTIONS - knownCount}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="filter-group filter-group--topic">
                        <span className="filter-label">Temat</span>
                        <select
                            className="topic-select"
                            value={topicFilter ?? ''}
                            onChange={(e) => setTopicFilter(e.target.value || null)}
                            aria-label="Filtruj po temacie"
                        >
                            <option value="">Wszystkie tematy</option>
                            {TOPIC_NAMES.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <QuestionsView focusTopicName={topicFilter} knownFilter={knownFilter} />
            </div>
        </div>
    );
}

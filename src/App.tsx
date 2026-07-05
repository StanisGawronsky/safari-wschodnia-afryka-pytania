import { useState } from 'react';
import { useKnownCount, type KnownFilter } from './hooks/useKnownQuestion';
import { RouteMap } from './components/RouteMap';
import { QuestionsView, scrollToPlace, TOTAL_QUESTIONS } from './components/QuestionsView';
import { type RoutePlace } from './data/places';

type Tab = 'map' | 'questions';

const KNOWN_FILTER_OPTIONS: { value: KnownFilter; label: string }[] = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'known', label: 'Umiem' },
    { value: 'unknown', label: 'Do nauki' },
];

export function App() {
    const knownCount = useKnownCount();
    const [tab, setTab] = useState<Tab>('map');
    const [selectedPlace, setSelectedPlace] = useState<RoutePlace | null>(null);
    const [questionsFilter, setQuestionsFilter] = useState<string | null>(null);
    const [knownFilter, setKnownFilter] = useState<KnownFilter>('all');

    const handleSelectPlace = (place: RoutePlace) => {
        setSelectedPlace(place);
        setQuestionsFilter(place.name);
        setTab('questions');
        window.setTimeout(() => scrollToPlace(place.name), 80);
    };

    return (
        <div className="app">
            <header className="app-header">
                <div>
                    <h1>Safari Wschodnia Afryka — trasa</h1>
                    <p className="app-subtitle">
                        11 miejsc · {TOTAL_QUESTIONS} pytań UbD
                        {knownCount > 0 && (
                            <span className="known-progress">
                                {' '}
                                · umiem: {knownCount}/{TOTAL_QUESTIONS}
                            </span>
                        )}
                    </p>
                </div>
                <nav className="app-tabs" aria-label="Widoki">
                    <button
                        type="button"
                        className={tab === 'map' ? 'tab active' : 'tab'}
                        onClick={() => setTab('map')}
                    >
                        Mapa
                    </button>
                    <button
                        type="button"
                        className={tab === 'questions' ? 'tab active' : 'tab'}
                        onClick={() => setTab('questions')}
                    >
                        Pytania
                    </button>
                </nav>
            </header>

            {tab === 'map' ? (
                <div className="map-panel">
                    <RouteMap selectedPlaceId={selectedPlace?.id} onSelectPlace={handleSelectPlace} />
                </div>
            ) : (
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
                                            <span className="filter-pill__count">
                                                {TOTAL_QUESTIONS - knownCount}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {questionsFilter && (
                            <div className="filter-group filter-group--place">
                                <span>
                                    Miejsce: <strong>{questionsFilter}</strong>
                                </span>
                                <button type="button" className="filter-clear" onClick={() => setQuestionsFilter(null)}>
                                    Wszystkie miejsca
                                </button>
                            </div>
                        )}
                    </div>
                    <QuestionsView focusPlaceName={questionsFilter} knownFilter={knownFilter} />
                </div>
            )}
        </div>
    );
}

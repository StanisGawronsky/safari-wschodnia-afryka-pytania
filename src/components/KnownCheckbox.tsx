import { useKnownQuestion } from '../hooks/useKnownQuestion';

type KnownCheckboxProps = {
    topic: string;
    question: string;
};

export function KnownCheckbox({ topic, question }: KnownCheckboxProps) {
    const { isKnown, toggle } = useKnownQuestion(topic, question);

    return (
        <label className={`known-check${isKnown ? ' known-check--on' : ''}`}>
            <input type="checkbox" className="known-check__input" checked={isKnown} onChange={toggle} />
            <span className="known-check__box" aria-hidden="true">
                <svg className="known-check__icon" viewBox="0 0 16 16" width="14" height="14">
                    <path
                        d="M3 8.5 6.5 12 13 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <span className="known-check__label">Umiem</span>
        </label>
    );
}

export function Keyboard({ onKeyPress }) {
    const rows = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["z", "x", "c", "v", "b", "n", "m"]
    ];

    return (
        <div className="keyboard">
            {rows.map((row, i) => (
                <div className="keyboard-row" key={i}>
                    {row.map(letter => (
                        <button
                            key={letter}
                            type="button"
                            data-key={letter}
                            aria-label={`add ${letter}`}
                            className="key"
                            onClick={() => onKeyPress && onKeyPress(letter)}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}

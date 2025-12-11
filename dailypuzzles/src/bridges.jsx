import { useState } from "react";
import "./styles/bridges.css";

const levels = [
  {
    cols: [1, 2, 4, 3, 4, 3],
    scols: [1, 2, 4, 3, 4, 3],
    rows: [3, 3, 1, 5, 2, 3],
    srows: [3, 3, 1, 5, 2, 3],
    boatj: 1,
    boati: 1,
    finalj: 5,
    finali: 1
  }
];

// Compute used bridges per row/column
function computeUsed(map) {
  const h = map.length;
  const w = map[0].length;

  const usedRows = new Array(w).fill(0);
  const usedCols = new Array(h).fill(0);

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (map[r][c] === 1) {
        usedRows[c] += 1;
        usedCols[r] += 1;
      }
    }
  }
  return { usedRows, usedCols };
}

// Compute remaining bridges for UI
function computeRemaining(map, level) {
  const { usedRows, usedCols } = computeUsed(map);

  const remainingRows = level.srows.map((target, col) => target - usedRows[col]);
  const remainingCols = level.scols.map((target, row) => target - usedCols[row]);

  return { remainingRows, remainingCols };
}

// BFS to check if path exists
function hasValidPath(map, start, end) {
  const h = map.length;
  const w = map[0].length;

  const visited = Array.from({ length: h }, () => Array(w).fill(false));
  const queue = [start];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    if (visited[r][c]) continue;
    visited[r][c] = true;

    if (r === end[0] && c === end[1]) return true;

    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;

      if (
        nr >= 0 &&
        nr < h &&
        nc >= 0 &&
        nc < w &&
        !visited[nr][nc] &&
        (map[nr][nc] === 1 || map[nr][nc] === 2)
      ) {
        queue.push([nr, nc]);
      }
    }
  }

  return false;
}

export default function Bridges() {
  const level = levels[0];

  const [gameOver, setGameOver] = useState(false);

  const [message, setMessage] = useState("");

  const [map, setMap] = useState(() => {
  const initial = Array.from({ length: level.scols.length }, () =>
    Array(level.srows.length).fill(0)
  );
  initial[level.boati - 1][level.boatj - 1] = 2;
  initial[level.finali - 1][level.finalj - 1] = 2;
  return initial;
});

const [remainingRows, setRemainingRows] = useState(() => [...level.rows]);
const [remainingCols, setRemainingCols] = useState(() => [...level.cols]);


  const toggleCell = (row, col) => {
    setMap(prev => {
      const newMap = prev.map(r => [...r]);

      if (newMap[row][col] === 2) return newMap; // cannot toggle start/end
      newMap[row][col] = newMap[row][col] === 1 ? 0 : 1;

      const { remainingRows: remRows, remainingCols: remCols } = computeRemaining(newMap, level);
      setRemainingRows(remRows);
      setRemainingCols(remCols);

      const allRowsZero = remRows.every(v => v === 0);
      const allColsZero = remCols.every(v => v === 0);

      if (allRowsZero && allColsZero) {
        const start = [level.boati - 1, level.boatj - 1];
        const end = [level.finali - 1, level.finalj - 1];

        if (hasValidPath(newMap, start, end)) {
          setGameOver(true);
          setMessage("🎉 You Win!");
        } else {
          setMessage("The path from start to finish is incomplete");
        }
      } else {
        setMessage(""); // clear message if not solved
      }

      return newMap;
    });
  };

  return (
    <div className="bridges-game game">
      <div className={`map size-${Math.max(level.srows.length, level.scols.length)}`}>
        <div style={{ display: "flex" }}>
          <div className="grid-block header empty"></div>
          {remainingRows.map((val, i) => (
            <div key={i} className={`grid-block header ${val === 0 ? "faded" : ""}`}>
              {val}
            </div>
          ))}
          <div className="grid-block header faded"></div>
        </div>

        {map.map((row, i) => (
          <div key={i} style={{ display: "flex" }}>
            <div className={`grid-block header ${remainingCols[i] === 0 ? "faded" : ""}`}>
              {remainingCols[i]}
            </div>
            {row.map((cell, j) => {
              const right = map[i][j + 1] > 0;
              const left = map[i][j - 1] > 0;
              const up = map[i - 1]?.[j] > 0;
              const down = map[i + 1]?.[j] > 0;

              return (
                <div
                  key={j}
                  className={`grid-block water
                    ${i === 0 ? "top" : ""} 
                    ${j === 0 ? "left" : ""} 
                    ${i === level.scols.length - 1 ? "bottom" : ""} 
                    ${j === level.srows.length - 1 ? "right" : ""}`}
                  onClick={() => !gameOver && toggleCell(i, j)}
                >
                  {cell > 0 && (
                    <div className={`bc ${cell === 2 ? "sturdy" : ""}`}>
                      <div className={`bridge ${cell === 2 ? "sturdy" : ""}`}></div>
                      {right && <div className="right"></div>}
                      {left && <div className="left"></div>}
                      {up && <div className="up"></div>}
                      {down && <div className="down"></div>}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="grid-block header faded"></div>
          </div>
        ))}
      </div>
      <div className="message">{message}</div>
    </div>
  );
}

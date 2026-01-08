import { useState, useEffect, useCallback, useMemo } from "react";
import HelpModal from "./components/HelpModal.jsx";
import { BridgesHelp } from "./components/Help.jsx";
import { BridgesWin } from "./components/Win.jsx";
import { fetchTodaysPuzzle, submitPuzzleStats } from "./components/FetchPuzzle.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./styles/bridges.css";

/*
  Cell values:
  0 = water
  1 = bridge
  2 = fixed (boat / destination)
*/

export default function Bridges({ modal, setModal }) {
  const [level, setLevel] = useState(null);
  const [map, setMap] = useState([]);
  const [remainingRows, setRemainingRows] = useState([]);
  const [remainingCols, setRemainingCols] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [puzztime, setPuzztime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ------------------------------------------------------------------ */
  /* Utility helpers                                                     */
  /* ------------------------------------------------------------------ */

  const computeUsed = useCallback((grid) => {
    const h = grid.length;
    const w = grid[0].length;

    const usedRows = Array(w).fill(0);
    const usedCols = Array(h).fill(0);

    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (grid[r][c] === 1) {
          usedRows[c] += 1;
          usedCols[r] += 1;
        }
      }
    }

    return { usedRows, usedCols };
  }, []);

  const computeRemaining = useCallback((grid, lvl) => {
    const { usedRows, usedCols } = computeUsed(grid);

    return {
      remainingCols: lvl.cols.map((target, i) => target - usedRows[i]),
      remainingRows: lvl.rows.map((target, i) => target - usedCols[i]),
    };
  }, [computeUsed]);

  const hasValidPath = useCallback((grid, start, end) => {
    const h = grid.length;
    const w = grid[0].length;
    const visited = Array.from({ length: h }, () => Array(w).fill(false));

    const queue = [start];
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    while (queue.length) {
      const [r, c] = queue.shift();
      if (visited[r][c]) continue;

      visited[r][c] = true;
      if (r === end[0] && c === end[1]) return true;

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;

        if (
          nr >= 0 && nr < h &&
          nc >= 0 && nc < w &&
          !visited[nr][nc] &&
          (grid[nr][nc] === 1 || grid[nr][nc] === 2)
        ) {
          queue.push([nr, nc]);
        }
      }
    }

    return false;
  }, []);

  /* ------------------------------------------------------------------ */
  /* Game logic                                                          */
  /* ------------------------------------------------------------------ */

  const checkWinCondition = useCallback((grid) => {
    const { remainingRows: rRows, remainingCols: rCols } = computeRemaining(grid, level);

    setRemainingRows(rRows);
    setRemainingCols(rCols);

    const solved = rRows.every(v => v === 0) && rCols.every(v => v === 0);
    if (!solved || gameOver) return;

    const start = [level.boat.i - 1, level.boat.j - 1];
    const end = [level.final.i - 1, level.final.j - 1];

    if (!hasValidPath(grid, start, end)) return;

    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);

    setGameOver(true);
    setPuzztime(timeTaken);
    setShowWinModal(true);

    const serializedMap = grid.map(row => row.join(","));
    submitPuzzleStats(timeTaken, "Bridges", serializedMap);
  }, [computeRemaining, gameOver, hasValidPath, level, startTime]);

  const toggleCell = useCallback((row, col) => {
    if (gameOver) return;

    setMap(prev => {
      const next = prev.map(r => [...r]);
      if (next[row][col] === 2) return next;

      next[row][col] = next[row][col] === 1 ? 0 : 1;
      checkWinCondition(next);
      return next;
    });
  }, [checkWinCondition, gameOver]);

  /* ------------------------------------------------------------------ */
  /* Initial load                                                        */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    async function loadPuzzle() {
      const puzzle = await fetchTodaysPuzzle("Bridges");

      let levelData;
      try {
        levelData = puzzle?.Data ? JSON.parse(puzzle.Data) : null;
      } catch {
        levelData = null;
      }

      if (!levelData) {
        levelData = {
          cols: [1, 2, 4, 3, 4],
          rows: [3, 3, 1, 5, 2],
          boat: { i: 1, j: 1 },
          final: { i: 5, j: 1 },
        };
      }

      setLevel(levelData);
      setStartTime(Date.now());

      const username = localStorage.getItem("username") || "guest";
      const today = new Date().toISOString().slice(0, 10);
      const puzzleId = `${today}_Bridges`;

      const statsRef = doc(db, "stats", `${username}_${puzzleId}`);
      const statsSnap = await getDoc(statsRef);

      let initialMap;

      if (statsSnap.exists()) {
        const data = statsSnap.data();
        setPuzztime(data.timeTaken);
        setGameOver(true);
        setShowWinModal(true);

        initialMap = data.finalMap
          ? data.finalMap.map(row => row.split(",").map(Number))
          : null;
      }

      if (!initialMap) {
        initialMap = Array.from({ length: levelData.rows.length }, () =>
          Array(levelData.cols.length).fill(0)
        );

        initialMap[levelData.boat.i - 1][levelData.boat.j - 1] = 2;
        initialMap[levelData.final.i - 1][levelData.final.j - 1] = 2;
      }

      setMap(initialMap);
      const { remainingRows: rRows, remainingCols: rCols } = computeRemaining(initialMap, levelData);
      setRemainingRows(rRows);
      setRemainingCols(rCols);
      setLoading(false);
    }

    loadPuzzle();
  }, [computeRemaining]);

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */

  if (loading) return <div className="bridges-game game" />;

  const sizeClass = `size-${Math.max(level.rows.length, level.cols.length)}`;


  return (
    <div className="bridges-game game">
      <HelpModal open={modal} onClose={() => setModal(false)} title="How to Play">
        <BridgesHelp />
      </HelpModal>

      <HelpModal open={showWinModal} onClose={() => setShowWinModal(false)} title="Congrats!">
        <BridgesWin puzztime={puzztime} />
      </HelpModal>

      <div className={`map ${sizeClass}`}>
        {/* Column headers */}
        <div style={{ display: "flex" }}>
          <div className="grid-block header empty" />
          {remainingCols.map((val, i) => (
            <div key={i} className={`grid-block header ${val === 0 ? "faded" : ""}`}>
              {val}
            </div>
          ))}
          <div className="grid-block header faded" />
        </div>

        {/* Grid */}
        {map.map((row, i) => (
          <div key={i} style={{ display: "flex" }}>
            <div className={`grid-block header ${remainingRows[i] === 0 ? "faded" : ""}`}>
              {remainingRows[i]}
            </div>

            {row.map((cell, j) => {
              const neighbors = {
                right: map[i][j + 1] > 0,
                left: map[i][j - 1] > 0,
                up: map[i - 1]?.[j] > 0,
                down: map[i + 1]?.[j] > 0,
              };

              return (
                <div
                  key={j}
                  className={`grid-block water
                    ${i === 0 ? "top" : ""}
                    ${j === 0 ? "left" : ""}
                    ${i === level.rows.length - 1 ? "bottom" : ""}
                    ${j === level.cols.length - 1 ? "right" : ""}`}
                  onClick={() => toggleCell(i, j)}
                >
                  {cell > 0 && (
                    <div className={`bc ${cell === 2 ? "sturdy" : ""}`}>
                      <div className={`bridge ${cell === 2 ? "sturdy" : ""}`} />
                      {neighbors.right && <div className="right" />}
                      {neighbors.left && <div className="left" />}
                      {neighbors.up && <div className="up" />}
                      {neighbors.down && <div className="down" />}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="grid-block header faded" />
          </div>
        ))}
      </div>

      {gameOver && !showWinModal && (
        <div onClick={() => setShowWinModal(true)} className="keyboard">
          <button className="alt">View Results</button>
        </div>
      )}
    </div>
  );
}

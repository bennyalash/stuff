import { useState, useEffect, useCallback, useMemo } from "react";
import HelpModal from "./components/HelpModal.jsx";
import { BridgesHelp } from "./components/Help.jsx";
import { BridgesWin } from "./components/Win.jsx";
import AdminPuzzleEditor from "./admin/AdminPuzzleEditor.jsx";
import {
  fetchTodaysPuzzle,
  submitPuzzleStats,
  fetchPuzzleByDate,
  savePuzzleByDate,
} from "./components/FetchPuzzle.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./styles/bridges.css";

// Hardcoded Admin Toggle
const IS_ADMIN = false;

const getTodayString = () => new Date().toISOString().slice(0, 10);

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

  // Editor / Admin state
  const [editorMode, setEditorMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [difficulty, setDifficulty] = useState("Medium");
  const [editorRows, setEditorRows] = useState(5);
  const [editorCols, setEditorCols] = useState(5);
  const [editorBoat, setEditorBoat] = useState(null);
  const [editorFinal, setEditorFinal] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ------------------------------------------------------------------ */
  /* Calculation Helpers                                                */
  /* ------------------------------------------------------------------ */

  const computeUsed = useCallback((grid) => {
    if (!grid.length || !grid[0]?.length) {
      return { usedRows: [], usedCols: [] };
    }
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

  const computeRemaining = useCallback(
    (grid, lvl) => {
      if (!grid.length || !lvl) {
        return { remainingCols: [], remainingRows: [] };
      }
      const { usedRows, usedCols } = computeUsed(grid);
      return {
        remainingCols: lvl.cols.map((target, i) => target - (usedRows[i] || 0)),
        remainingRows: lvl.rows.map((target, i) => target - (usedCols[i] || 0)),
      };
    },
    [computeUsed]
  );

  const hasValidPath = useCallback((grid, start, end) => {
    const h = grid.length;
    const w = grid[0].length;
    const visited = Array.from({ length: h }, () => Array(w).fill(false));
    const queue = [start];
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    while (queue.length) {
      const [r, c] = queue.shift();
      if (visited[r][c]) continue;
      visited[r][c] = true;

      if (r === end[0] && c === end[1]) return true;

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 && nr < h && nc >= 0 && nc < w &&
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
  /* Game Logic & Win Check                                             */
  /* ------------------------------------------------------------------ */

  const checkWinCondition = useCallback(
    (grid) => {
      if (!level || editorMode) return;

      const { remainingRows: rRows, remainingCols: rCols } = computeRemaining(grid, level);
      setRemainingRows(rRows);
      setRemainingCols(rCols);

      const solved = rRows.every((v) => v === 0) && rCols.every((v) => v === 0);
      if (!solved || gameOver) return;

      const start = [level.boat.i - 1, level.boat.j - 1];
      const end = [level.final.i - 1, level.final.j - 1];

      if (!hasValidPath(grid, start, end)) return;

      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - startTime) / 1000);

      setGameOver(true);
      setPuzztime(timeTaken);
      setShowWinModal(true);

      const serializedMap = grid.map((row) => row.join(","));
      submitPuzzleStats(timeTaken, "Bridges", serializedMap);
    },
    [computeRemaining, gameOver, hasValidPath, level, startTime, editorMode]
  );

  /* ------------------------------------------------------------------ */
  /* Editor Handlers                                                    */
  /* ------------------------------------------------------------------ */

  const toggleEditorCell = useCallback(
    (row, col) => {
      setMap((prev) => {
        const next = prev.map((r) => [...r]);
        const current = next[row][col];

        if (current === 0) {
          next[row][col] = 1;
          return next;
        }

        if (current === 1) {
          next[row][col] = 2;
          if (!editorBoat) {
            setEditorBoat({ i: row, j: col });
          } else if (!editorFinal) {
            setEditorFinal({ i: row, j: col });
          }
          return next;
        }

        if (current === 2) {
          next[row][col] = 0;
          if (editorBoat?.i === row && editorBoat?.j === col) setEditorBoat(null);
          if (editorFinal?.i === row && editorFinal?.j === col) setEditorFinal(null);
          return next;
        }

        return next;
      });
    },
    [editorBoat, editorFinal]
  );

  const toggleCell = useCallback(
    (row, col) => {
      if (editorMode) {
        toggleEditorCell(row, col);
        return;
      }

      if (gameOver) return;

      setMap((prev) => {
        const next = prev.map((r) => [...r]);
        if (next[row][col] === 2) return next;
        next[row][col] = next[row][col] === 1 ? 0 : 1;
        checkWinCondition(next);
        return next;
      });
    },
    [editorMode, toggleEditorCell, gameOver, checkWinCondition]
  );

  const createEmptyGrid = useCallback((rCount, cCount) => {
    return Array.from({ length: rCount }, () => Array(cCount).fill(0));
  }, []);

  const resizeEditorGrid = useCallback(() => {
    const rows = Math.max(1, Math.min(20, Number(editorRows) || 1));
    const cols = Math.max(1, Math.min(20, Number(editorCols) || 1));

    setEditorRows(rows);
    setEditorCols(cols);

    const newMap = createEmptyGrid(rows, cols);
    const newLevel = {
      rows: Array(rows).fill(0),
      cols: Array(cols).fill(0),
      boat: null,
      final: null,
    };

    setLevel(newLevel);
    setMap(newMap);
    setEditorBoat(null);
    setEditorFinal(null);
    setRemainingRows(Array(rows).fill(0));
    setRemainingCols(Array(cols).fill(0));
  }, [editorRows, editorCols, createEmptyGrid]);

  // Load puzzle logic when date changes in editor mode
  const loadEditorPuzzleForDate = useCallback(
    async (dateStr) => {
      setLoading(true);
      const puzzleDoc = await fetchPuzzleByDate("Bridges", dateStr);

      if (puzzleDoc && puzzleDoc.Data) {
        try {
          const parsed = JSON.parse(puzzleDoc.Data);
          setLevel(parsed);
          setDifficulty(puzzleDoc.Difficulty || "Medium");
          setEditorRows(parsed.rows.length);
          setEditorCols(parsed.cols.length);

          const rCount = parsed.rows.length;
          const cCount = parsed.cols.length;
          const emptyGrid = createEmptyGrid(rCount, cCount);

          if (parsed.boat) {
            setEditorBoat({ i: parsed.boat.i - 1, j: parsed.boat.j - 1 });
            emptyGrid[parsed.boat.i - 1][parsed.boat.j - 1] = 2;
          } else {
            setEditorBoat(null);
          }

          if (parsed.final) {
            setEditorFinal({ i: parsed.final.i - 1, j: parsed.final.j - 1 });
            emptyGrid[parsed.final.i - 1][parsed.final.j - 1] = 2;
          } else {
            setEditorFinal(null);
          }

          setMap(emptyGrid);
          setRemainingRows(parsed.rows);
          setRemainingCols(parsed.cols);
        } catch {
          resizeEditorGrid();
        }
      } else {
        resizeEditorGrid();
      }
      setLoading(false);
    },
    [createEmptyGrid, resizeEditorGrid]
  );

  useEffect(() => {
    if (editorMode) {
      loadEditorPuzzleForDate(selectedDate);
    }
  }, [selectedDate, editorMode, loadEditorPuzzleForDate]);

  /* ------------------------------------------------------------------ */
  /* Save Editor Data to Firestore                                     */
  /* ------------------------------------------------------------------ */

  const editorData = useMemo(() => {
    if (!level || !map.length) return null;
    const { usedRows, usedCols } = computeUsed(map);

    return {
      cols: usedRows,
      rows: usedCols,
      boat: editorBoat ? { i: editorBoat.i + 1, j: editorBoat.j + 1 } : null,
      final: editorFinal ? { i: editorFinal.i + 1, j: editorFinal.j + 1 } : null,
    };
  }, [level, map, editorBoat, editorFinal, computeUsed]);

  const handleSavePuzzle = async () => {
    if (!editorData) return;
    setSaving(true);
    try {
      await savePuzzleByDate("Bridges", selectedDate, editorData, difficulty);
      alert(`Puzzle for ${selectedDate} saved successfully!`);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save puzzle.");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Initial Player Load                                                */
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
      setEditorRows(levelData.rows.length);
      setEditorCols(levelData.cols.length);
      setStartTime(Date.now());

      const username = localStorage.getItem("username") || "guest";
      const puzzleId = `${getTodayString()}_Bridges`;
      const statsRef = doc(db, "stats", `${username}_${puzzleId}`);
      const statsSnap = await getDoc(statsRef);

      let initialMap;
      if (statsSnap.exists()) {
        const data = statsSnap.data();
        setPuzztime(data.timeTaken);
        setGameOver(true);
        initialMap = data.finalMap
          ? data.finalMap.map((row) => row.split(",").map(Number))
          : null;
      }

      if (!initialMap) {
        initialMap = createEmptyGrid(levelData.rows.length, levelData.cols.length);
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
  }, [computeRemaining, createEmptyGrid]);

  if (loading) {
    return <div className="bridges-game game" />;
  }

  const sizeClass = `size-${Math.max(level?.rows?.length || 5, level?.cols?.length || 5)}`;

  return (
    <div className="bridges-game game">
      <HelpModal open={modal} onClose={() => setModal(false)} title="How to Play">
        <BridgesHelp />
      </HelpModal>

      <HelpModal open={showWinModal} onClose={() => setShowWinModal(false)} title="Congrats!">
        <BridgesWin puzztime={puzztime} />
      </HelpModal>

      {/* Admin Mode Toggle */}
      {IS_ADMIN && (
        <div className="admin-toggle-wrapper">
          <button onClick={() => setEditorMode((prev) => !prev)}>
            {editorMode ? "Exit Editor Mode" : "Enter Editor Mode"}
          </button>
        </div>
      )}

      {/* Admin Editor Control Panel */}
      {IS_ADMIN && editorMode && (
        <AdminPuzzleEditor
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          editorRows={editorRows}
          setEditorRows={setEditorRows}
          editorCols={editorCols}
          setEditorCols={setEditorCols}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          onResize={resizeEditorGrid}
          onSave={handleSavePuzzle}
          saving={saving}
        />
      )}

      {/* Game / Editor Board */}
      <div className={`map ${sizeClass}`}>
        <div style={{ display: "flex" }}>
          <div className="grid-block header empty" />
          {remainingCols.map((val, i) => (
            <div key={i} className={`grid-block header ${val === 0 ? "faded" : ""}`}>
              {val}
            </div>
          ))}
          <div className="grid-block header faded" />
        </div>

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

              const isBoat = editorMode && editorBoat?.i === i && editorBoat?.j === j;
              const isFinal = editorMode && editorFinal?.i === i && editorFinal?.j === j;

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
                      {isBoat && <div className="editor-marker boat">B</div>}
                      {isFinal && <div className="editor-marker final">F</div>}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="grid-block header faded" />
          </div>
        ))}
      </div>

      {gameOver && !showWinModal && !editorMode && (
        <div onClick={() => setShowWinModal(true)} className="keyboard">
          <button className="alt">View Results</button>
        </div>
      )}
    </div>
  );
}
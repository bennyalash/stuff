import React, { useState, useEffect, useRef } from "react";
import "./styles/cipher.css";

const initialGrid = [
  "Y","E","A","R",
  "A","C","R","E",
  "W","H","I","P",
  "N","O","D","S"
];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function findMatch(array) {
  // inner 3x3 of the initial grid
  
  const gridStart = [
    initialGrid[5], initialGrid[6], initialGrid[7],
    initialGrid[9], initialGrid[11],
    initialGrid[13], initialGrid[14], initialGrid[15],
  ];

  // inner 3x3 of the array being checked
  const mixedGrid = [
    array[5], array[6], array[7],
    array[9], array[11],
    array[13], array[14], array[15],
  ];
  

  // find all matching indices
  const matches = mixedGrid
    .map((val, i) => (val === gridStart[i] ? i : null))
    .filter((i) => i !== null);

  return {
    anyMatch: matches.length > 0,
    matches
  };
}


function shuffleInner(array, minMoves = 1) {
  const SIZE = 4;
  const a = [...array];

  const getIndex = (r, c) => r * SIZE + c;

  const moves = [
    () => { const i1=getIndex(1,1),i2=getIndex(1,2),i3=getIndex(1,3); [a[i1],a[i2],a[i3]]=[a[i2],a[i3],a[i1]]; },
    () => { const i1=getIndex(3,1),i2=getIndex(3,2),i3=getIndex(3,3); [a[i1],a[i2],a[i3]]=[a[i3],a[i1],a[i2]]; },
    () => { const i1=getIndex(1,1),i2=getIndex(2,1),i3=getIndex(3,1); [a[i1],a[i2],a[i3]]=[a[i2],a[i3],a[i1]]; },
    () => { const i1=getIndex(1,3),i2=getIndex(2,3),i3=getIndex(3,3); [a[i1],a[i2],a[i3]]=[a[i3],a[i1],a[i2]]; }
  ];

  // Perform minimum moves
  for (let k = 0; k < minMoves; k++) {
    moves[Math.floor(Math.random() * moves.length)]();
  }

  // Try up to 10 more times to eliminate any matches
  let result = findMatch(a);
  let attempts = 0;

  while (result.anyMatch && attempts < 100) {
    moves[Math.floor(Math.random() * moves.length)]();
    result = findMatch(a);
    attempts++;
  }

  return [
    a[5], a[6], a[7],
    a[9], a[10], a[11],
    a[13], a[14], a[15],
  ];
}







// Example usage:
// const sixteenTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
// const shuffled = shuffleInner(sixteenTiles);
// console.log(shuffled);

export default function Cipher() {
  const FULL_SIZE = 4;
  const SIZE = FULL_SIZE - 1;
const [CELL_SIZE, setCELL_SIZE] = useState(() =>Math.floor(Math.min(window.innerWidth, 500) / (FULL_SIZE*1.5)));


  useEffect(() => {
    // Function to recalculate and update the state
    const handleResize = () => {
      const newSize =Math.floor(Math.min(window.innerWidth, 500) / (FULL_SIZE*1.5));
      setCELL_SIZE(newSize);
    };

    // 2. Attach the listener when the component mounts
    window.addEventListener('resize', handleResize);

    // 3. Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [grid, setGrid] = useState(() => shuffleInner(initialGrid));

  // dragging state
  const [drag, setDrag] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const dragRef = useRef(null);
  dragRef.current = drag;

  // visual remainder (px) for each row/col while dragging
  const [remainderX, setRemainderX] = useState(Array(SIZE).fill(0)); // px
  const [remainderY, setRemainderY] = useState(Array(SIZE).fill(0)); // px

  // logical integer shift (can be any integer while dragging; normalized for rendering)
  const [shiftX, setShiftX] = useState(Array(SIZE).fill(0)); // integer cells
  const [shiftY, setShiftY] = useState(Array(SIZE).fill(0)); // integer cells

  const shiftXRef = useRef(Array(SIZE).fill(0));
const shiftYRef = useRef(Array(SIZE).fill(0));
const directionRef = useRef(null);

  // direction: "X" | "Y" | null
  const [direction, setDirection] = useState(null);

  // rotate row to the right by `shift` (positive = right)
  const rotateRow = (row, shift) => {
    const s = ((shift % SIZE) + SIZE) % SIZE;
    if (s === 0) return;
    const newGrid = [...grid];
    const start = row * SIZE;
    const oldRow = newGrid.slice(start, start + SIZE);
    const newRow = Array(SIZE);
    for (let i = 0; i < SIZE; i++) {
      newRow[(i + s) % SIZE] = oldRow[i];
    }
    for (let i = 0; i < SIZE; i++) newGrid[start + i] = newRow[i];
    setGrid(newGrid);
  };

  // rotate column down by `shift` (positive = down)
  const rotateCol = (col, shift) => {
    const s = ((shift % SIZE) + SIZE) % SIZE;
    if (s === 0) return;
    const newGrid = [...grid];
    const oldCol = Array.from({ length: SIZE }, (_, r) => newGrid[r * SIZE + col]);
    const newCol = Array(SIZE);
    for (let i = 0; i < SIZE; i++) {
      newCol[(i + s) % SIZE] = oldCol[i];
    }
    for (let r = 0; r < SIZE; r++) newGrid[r * SIZE + col] = newCol[r];
    setGrid(newGrid);
  };

  // helpers for modular rendering while dragging:
  // If row has logical integer shift S (positive = moved right by S),
  // then cell at column c should display original column (c - S).
  const getRowLetter = (row, col, s) => {
    const idx = ((col - s) % SIZE + SIZE) % SIZE;
    return grid[row * SIZE + idx];
  };

  // If column has logical integer shift S (positive = moved down by S),
  // then cell at row r should display original row (r - S).
  const getColLetter = (row, col, s) => {
    const rIdx = ((row - s) % SIZE + SIZE) % SIZE;
    return grid[rIdx * SIZE + col];
  };

  const extractClient = (e) => {
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }
  return {
    x: e.clientX,
    y: e.clientY
  };
};


  // start dragging
 const handlePointerDown = (e, row, col) => {
  //e.preventDefault();
  const { x, y } = extractClient(e);

  setDrag({ startX: x, startY: y, row, col });
  setDirection(null);
  directionRef.current = null;

  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);

  // Mobile support
  window.addEventListener("touchmove", onPointerMove, { passive: false });
  window.addEventListener("touchend", onPointerUp);
};


  // window-level move & up handlers to capture outside-grid drags
  const onPointerMove = (e) => {
  e.preventDefault();
  const d = dragRef.current;
  if (!d) return;

  const { x, y } = extractClient(e);
  const dx = x - d.startX;
  const dy = y - d.startY;

  // Existing direction + shift logic remains EXACTLY THE SAME:

  if (!directionRef.current) {
    if (Math.abs(dy) > Math.abs(dx)) {
      setDirection("Y");
      directionRef.current = "Y";
    } else {
      setDirection("X");
      directionRef.current = "X";
    }
  }

  if (d.row === 1 && d.col === 1) {
    setDrag(null);
    setDirection(null);
    directionRef.current = null;
    return;
  }
  if (d.row === 1) {
    setDirection("Y");
    directionRef.current = "Y";
  }
  if (d.col === 1) {
    setDirection("X");
    directionRef.current = "X";
  }

  if (directionRef.current === "X") {
    const row = d.row;
    const totalShift = Math.round(dx / CELL_SIZE);
    const rem = dx - totalShift * CELL_SIZE;

    setShiftX((prev) => {
      const next = [...prev];
      next[row] = totalShift;
      shiftXRef.current = next;
      return next;
    });

    setRemainderX((prev) => {
      const next = [...prev];
      next[row] = rem;
      return next;
    });
  }

  if (directionRef.current === "Y") {
    const col = d.col;
    const totalShift = Math.round(dy / CELL_SIZE);
    const rem = dy - totalShift * CELL_SIZE;

    setShiftY((prev) => {
      const next = [...prev];
      next[col] = totalShift;
      shiftYRef.current = next;
      return next;
    });

    setRemainderY((prev) => {
      const next = [...prev];
      next[col] = rem;
      return next;
    });
  }
};

const onPointerUp = () => {
  const d = dragRef.current;

  if (d) {
    if (directionRef.current === "X") {
      const row = d.row;
      rotateRow(row, shiftXRef.current[row] || 0);
    } else if (directionRef.current === "Y") {
      const col = d.col;
      rotateCol(col, shiftYRef.current[col] || 0);
    }
  }

  setDrag(null);
  setDirection(null);
  directionRef.current = null;

  setShiftX(Array(SIZE).fill(0));
  setShiftY(Array(SIZE).fill(0));
  setRemainderX(Array(SIZE).fill(0));
  setRemainderY(Array(SIZE).fill(0));

  window.removeEventListener("mousemove", onPointerMove);
  window.removeEventListener("mouseup", onPointerUp);

  window.removeEventListener("touchmove", onPointerMove);
  window.removeEventListener("touchend", onPointerUp);
};


const solvedInner = [
  initialGrid[5], initialGrid[6], initialGrid[7],
  initialGrid[9], initialGrid[10], initialGrid[11],
  initialGrid[13], initialGrid[14], initialGrid[15],
];

function isPuzzleComplete(currentGrid) {

  // currentGrid is your 9-tile inner grid
  return currentGrid.every((tile, idx) => tile === solvedInner[idx]);
}

useEffect(() => {
  const innerGrid = [
    grid[0], grid[1], grid[2],
    grid[3], grid[4], grid[5],
    grid[6], grid[7], grid[8],
  ];
  if (isPuzzleComplete(innerGrid)) {

    setGameOver(true);
  }
}, [grid]);

  return (
    <div className={`cipher-game game hint ${gameOver && "complete"}`} style={{fontSize:CELL_SIZE/1.5+"px"}}>
      <div className={`letter-grid ${drag == null && "still"}`} style={{ userSelect: "none" }}>
      <div className="letter-grid-bg"> 
      <div className="grid-row header">
        <div key={"i1"} style={{width: CELL_SIZE + "px",height: CELL_SIZE + "px"}} className="grid-cell">{initialGrid[0]}</div>
        <div key={"i2"} style={{width: CELL_SIZE + "px",height: CELL_SIZE + "px"}} className="grid-cell">{initialGrid[1]}</div>
        <div key={"i3"} style={{width: CELL_SIZE + "px",height: CELL_SIZE + "px"}} className="grid-cell">{initialGrid[2]}</div>
        <div key={"i4"} style={{width: CELL_SIZE + "px",height: CELL_SIZE + "px"}} className="grid-cell">{initialGrid[3]}</div>
        </div>
        {Array.from({ length: SIZE }).map((_, r) => {
          // row transform when dragging that row: remainderX[r] px
          const tx = remainderX[r] || 0;

          return (
              <div key={r+"ogr"} className="outside-grid-row">
              <div
                    key={r+'i'}
                className="grid-row header"
                  >
                    <div style={{
                      width: CELL_SIZE + "px",
                      height: CELL_SIZE + "px"}} className="grid-cell">{initialGrid[r*4+4]}</div>
                  </div>
            <div
              key={r}
              className="grid-row"
              style={{
                transform: `translateX(${tx}px)`,
                display: "flex"
              }}
            >
              {Array.from({ length: SIZE }).map((_, c) => {
                // during X drag, we render row-modular letters
                // during Y drag, we render column-modular letters
                let letter = grid[r * SIZE + c];
                if (directionRef.current === "X" && dragRef.current) {
                  const s = shiftX[r] || 0;
                  letter = getRowLetter(r, c, s);
                } else if (directionRef.current === "Y" && dragRef.current) {
                  const s = shiftY[c] || 0;
                  letter = getColLetter(r, c, s);
                }

                const ty = remainderY[c] || 0; // column remainder translateY
                if(letter == initialGrid[r*SIZE+c]){
                    
                }

                return (
                  <div
                    key={c}
                    className={`grid-cell  ${r*(SIZE+1)+c == 5 && "header"} ${letter == initialGrid[r*(SIZE+1)+c+5] && "correct"}`}
                    onMouseDown={(e) => !gameOver && handlePointerDown(e, r, c)}
                    onTouchStart={(e) => !gameOver && handlePointerDown(e, r, c)}
                    style={{
                      width: CELL_SIZE + "px",
                      height: CELL_SIZE + "px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: `translateY(${ty}px)`,
                      boxSizing: "border-box",
                      cursor: "grab",
                      userSelect: "none"
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </div></div>
          )
        })}
      </div>
      </div>
      <br />
       <div className="message">{gameOver ? "You Win!" : "Slide rows and columns to complete the word grid"}</div>
    </div>
  );
}

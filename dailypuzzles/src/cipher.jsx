import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles/cipher.css";
import HelpModal from "./components/HelpModal.jsx";
import { CipherHelp } from "./components/Help.jsx";
import { doc, getDoc } from "firebase/firestore";

// 🔽 Added for end-of-game stats
import { CipherWin } from "./components/Win.jsx";
import { submitPuzzleStats, fetchTodaysPuzzle } from "./components/FetchPuzzle.jsx";
import { db, auth } from "./firebase";

const initialGrid = [
  "Y","E","A","R",
  "A","C","R","E",
  "W","H","I","P",
  "N","O","D","S"
];

function findMatch(array) {
  const gridStart = [
    initialGrid[5], initialGrid[6], initialGrid[7],
    initialGrid[9], array[10], initialGrid[11],
    initialGrid[13], initialGrid[14], initialGrid[15],
  ];

  const mixedGrid = [
    array[5], array[6], array[7],
    array[9], array[10], array[11],
    array[13], array[14], array[15],
  ];

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
    () => { const i1=getIndex(1,3),i2=getIndex(2,3),i3=getIndex(3,3); [a[i1],a[i2],a[i3]]=[a[i3],a[i1],a[i2]]; },
    () => { const i1=getIndex(2,1),i2=getIndex(2,2),i3=getIndex(2,3); [a[i1],a[i2],a[i3]]=[a[i2],a[i3],a[i1]]; },
    () => { const i1=getIndex(1,2),i2=getIndex(2,2),i3=getIndex(3,2); [a[i1],a[i2],a[i3]]=[a[i2],a[i3],a[i1]]; }
  ];

  for (let k = 0; k < minMoves; k++) moves[Math.floor(Math.random()*moves.length)]();

  let result = findMatch(a);
  let attempts = 0;

  while (result.anyMatch && attempts < 1000) {
    moves[Math.floor(Math.random()*moves.length)]();
    result = findMatch(a);
    attempts++;
  }

  return [
    a[5], a[6], a[7],
    a[9], a[10], a[11],
    a[13], a[14], a[15],
  ];
}

export default function Cipher({ modal, setModal }) {
  const FULL_SIZE = 4;
  const SIZE = FULL_SIZE - 1;
  const [CELL_SIZE, setCELL_SIZE] = useState(() =>
    Math.floor(Math.min(window.innerWidth, 500) / (FULL_SIZE * 1.5))
  );

  // 🔽 Added for end-of-game stats
  const [startTime, setStartTime] = useState(null);
  const [puzztime, setPuzztime] = useState(null);
  const [winModal, setWinModal] = useState(false);
  const hasSubmittedRef = useRef(false);


  useEffect(() => {
    const handleResize = () => {
      const newSize = Math.floor(Math.min(window.innerWidth, 500) / (FULL_SIZE*1.5));
      setCELL_SIZE(newSize);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function loadPuzzle() {
      const puzzle = await fetchTodaysPuzzle("Cipher");

      let levelData;
      try {
        levelData = puzzle?.Data ? JSON.parse(puzzle.Data) : null;
      } catch {
        levelData = null;
      }

      if (!levelData) {
        levelData = [
          "Y","E","A","R",
          "A","C","R","E",
          "W","H","I","P",
          "N","O","D","S"
        ]
      }

      setGrid(shuffleInner(levelData));
      setStartTime(Date.now());

      const username = localStorage.getItem("username") || "guest";
      const today = new Date().toISOString().slice(0, 10);
      const puzzleId = `${today}_Cipher`;

      const statsRef = doc(db, "stats", `${username}_${puzzleId}`);
      const statsSnap = await getDoc(statsRef);

      if (statsSnap.exists()) {
        const data = statsSnap.data();
        setPuzztime(data.timeTaken);
        setGameOver(true);
        setWinModal(true);
      setGrid(levelData);

      }
      else{
        setGrid(shuffleInner(levelData));

      }
    }

    loadPuzzle();
  }, []);

  const [grid, setGrid] = useState(null);

  const [drag, setDrag] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const dragRef = useRef(null);

  useEffect(() => { dragRef.current = drag; }, [drag]);

  const [remainderX, setRemainderX] = useState(Array(SIZE).fill(0));
  const [remainderY, setRemainderY] = useState(Array(SIZE).fill(0));
  const [shiftX, setShiftX] = useState(Array(SIZE).fill(0));
  const [shiftY, setShiftY] = useState(Array(SIZE).fill(0));

  const shiftXRef = useRef(Array(SIZE).fill(0));
  const shiftYRef = useRef(Array(SIZE).fill(0));
  const directionRef = useRef(null);
  const [_direction, setDirection] = useState(null);

  const rotateRow = (row, shift) => {
    const s = ((shift % SIZE) + SIZE) % SIZE;
    if (s===0) return;
    const newGrid = [...grid];
    const start = row*SIZE;
    const oldRow = newGrid.slice(start,start+SIZE);
    const newRow = Array(SIZE);
    for (let i=0;i<SIZE;i++) newRow[(i+s)%SIZE]=oldRow[i];
    for (let i=0;i<SIZE;i++) newGrid[start+i]=newRow[i];
    setGrid(newGrid);
  };

  const rotateCol = (col, shift) => {
    const s = ((shift%SIZE)+SIZE)%SIZE;
    if(s===0) return;
    const newGrid = [...grid];
    const oldCol = Array.from({length: SIZE}, (_, r)=>newGrid[r*SIZE+col]);
    const newCol = Array(SIZE);
    for(let i=0;i<SIZE;i++) newCol[(i+s)%SIZE]=oldCol[i];
    for(let r=0;r<SIZE;r++) newGrid[r*SIZE+col]=newCol[r];
    setGrid(newGrid);
  };

  const getRowLetter=(row,col,s)=>{const idx=((col-s)%SIZE+SIZE)%SIZE;return grid[row*SIZE+idx];};
  const getColLetter=(row,col,s)=>{const rIdx=((row-s)%SIZE+SIZE)%SIZE;return grid[rIdx*SIZE+col];};

  const extractClient=(e)=>e.touches&&e.touches.length>0?{x:e.touches[0].clientX,y:e.touches[0].clientY}:{x:e.clientX,y:e.clientY};

  const handlePointerDown=(e,row,col)=>{
    const {x,y}=extractClient(e);
    setDrag({startX:x,startY:y,row,col});
    setDirection(null);
    directionRef.current=null;

    window.addEventListener("mousemove",onPointerMove);
    window.addEventListener("mouseup",onPointerUp);
    window.addEventListener("touchmove",onPointerMove,{passive:false});
    window.addEventListener("touchend",onPointerUp);
  };

  const onPointerMove=(e)=>{
    e.preventDefault();
    const d = dragRef.current;
    if(!d) return;
    const {x,y}=extractClient(e);
    const dx=x-d.startX, dy=y-d.startY;

    if(!directionRef.current){
      if(Math.abs(dy)>Math.abs(dx)){setDirection("Y");directionRef.current="Y";}
      else{setDirection("X");directionRef.current="X";}
    }

    if(directionRef.current==="X"){
      const row=d.row,totalShift=Math.round(dx/CELL_SIZE),rem=dx-totalShift*CELL_SIZE;
      setShiftX(prev=>{const next=[...prev];next[row]=totalShift;shiftXRef.current=next;return next;});
      setRemainderX(prev=>{const next=[...prev];next[row]=rem;return next;});
    }
    if(directionRef.current==="Y"){
      const col=d.col,totalShift=Math.round(dy/CELL_SIZE),rem=dy-totalShift*CELL_SIZE;
      setShiftY(prev=>{const next=[...prev];next[col]=totalShift;shiftYRef.current=next;return next;});
      setRemainderY(prev=>{const next=[...prev];next[col]=rem;return next;});
    }
  };

  const onPointerUp=()=>{
    const d=dragRef.current;
    if(d){
      if(directionRef.current==="X"){rotateRow(d.row,shiftXRef.current[d.row]||0);}
      else if(directionRef.current==="Y"){rotateCol(d.col,shiftYRef.current[d.col]||0);}
    }

    setDrag(null);
    setDirection(null);
    directionRef.current=null;
    setShiftX(Array(SIZE).fill(0));
    setShiftY(Array(SIZE).fill(0));
    setRemainderX(Array(SIZE).fill(0));
    setRemainderY(Array(SIZE).fill(0));

    window.removeEventListener("mousemove",onPointerMove);
    window.removeEventListener("mouseup",onPointerUp);
    window.removeEventListener("touchmove",onPointerMove);
    window.removeEventListener("touchend",onPointerUp);
  };

  const solvedInner=[
    initialGrid[5], initialGrid[6], initialGrid[7],
    initialGrid[9], initialGrid[10], initialGrid[11],
    initialGrid[13], initialGrid[14], initialGrid[15],
  ];

  const isPuzzleComplete=useCallback((currentGrid)=>currentGrid.every((tile,idx)=>tile===solvedInner[idx]),[]);

  useEffect(()=>{
        if(grid == null) return;

    const innerGrid=[
      grid[0],grid[1],grid[2],
      grid[3],grid[4],grid[5],
      grid[6],grid[7],grid[8],
    ];
    if(isPuzzleComplete(innerGrid)){
      const id=setTimeout(()=>setGameOver(true),0);
      return ()=>clearTimeout(id);
    }
  },[grid,isPuzzleComplete]);

  // 🔽 Added — submit stats once and show modal
  useEffect(()=>{
    if(!gameOver || hasSubmittedRef.current) return;
    hasSubmittedRef.current=true;
    const endTime=Date.now();
    const timeTaken=Math.floor((endTime-startTime)/1000);
    setPuzztime(timeTaken);
    setWinModal(true);

      submitPuzzleStats(timeTaken,"Cipher", null);

  },[gameOver,startTime]);

  if(grid == null) return;

  return (
    <div className={`cipher-game game hint ${gameOver && "complete"}`} style={{fontSize:CELL_SIZE/1.5+"px"}}>
      <HelpModal open={modal} onClose={()=>setModal(false)} title="How to Play"><CipherHelp/></HelpModal>
      <HelpModal open={winModal} onClose={()=>setWinModal(false)} title="Solved!"><CipherWin puzztime={puzztime}/></HelpModal>

      <div className={`letter-grid ${drag==null && "still"}`} style={{userSelect:"none"}}>
        <div className="letter-grid-bg">
          <div className="grid-row header">
            {initialGrid.slice(0,4).map((l,i)=><div key={"i"+i} style={{width:CELL_SIZE+"px",height:CELL_SIZE+"px"}} className="grid-cell">{l}</div>)}
          </div>
          {Array.from({length:SIZE}).map((_,r)=>{
            const tx=remainderX[r]||0;
            return (
              <div key={r+"ogr"} className="outside-grid-row">
                <div key={r+'i'} className="grid-row header">
                  <div style={{width:CELL_SIZE+"px",height:CELL_SIZE+"px"}} className="grid-cell">{initialGrid[r*4+4]}</div>
                </div>
                <div key={r} className="grid-row" style={{transform:`translateX(${tx}px)`,display:"flex"}}>
                  {Array.from({length:SIZE}).map((_,c)=>{
                    let letter=grid[r*SIZE+c];
                    if(_direction==="X" && drag){letter=getRowLetter(r,c,shiftX[r]||0);}
                    else if(_direction==="Y" && drag){letter=getColLetter(r,c,shiftY[c]||0);}
                    const ty=remainderY[c]||0;
                    return (
                      <div key={c} className={`grid-cell correct ${r*(SIZE+1)+c===5 && "old-header"} ${letter===initialGrid[r*(SIZE+1)+c+5] && "correct"}`}
                        onMouseDown={(e)=>!gameOver&&handlePointerDown(e,r,c)}
                        onTouchStart={(e)=>!gameOver&&handlePointerDown(e,r,c)}
                        style={{width:CELL_SIZE+"px",height:CELL_SIZE+"px",display:"flex",alignItems:"center",justifyContent:"center",transform:`translateY(${ty}px)`,boxSizing:"border-box",cursor:"grab",userSelect:"none"}}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {gameOver && !winModal && (
        <div onClick={() => setWinModal(true)} className="keyboard">
          <button className="alt">View Results</button>
        </div>
      )}
    </div>
  );
}
